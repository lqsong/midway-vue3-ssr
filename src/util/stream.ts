// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Readable, PassThrough, Writable } from 'stream';
const slice = Array.prototype.slice;

class StringStream extends Readable {
  private _str: any;
  private _encoding: any;
  ended: boolean;
  constructor(str, encoding) {
    super();
    this._str = str;
    this._encoding = encoding || 'utf8';
  }

  _read() {
    if (!this.ended) {
      process.nextTick(() => {
        this.push(Buffer.from(this._str, this._encoding));
        this.push(null);
      });
      this.ended = true;
    }
  }
}

/**
 * 字符串转 stream
 * @param str string 字符串
 * @param encoding  string 编码
 * @returns stream
 */
export function stringToStream(str: string, encoding?: string) {
  return new StringStream(str, encoding);
}

/**
 * 检查并暂停管道流
 * @param streams
 * @param options
 * @returns
 */
export function pauseStreams(streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) {
      streams = streams.pipe(PassThrough(options));
    }
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.');
    }
    streams.pause();
  } else {
    for (let i = 0, len = streams.length; i < len; i++) {
      streams[i] = pauseStreams(streams[i], options);
    }
  }
  return streams;
}

/**
 * 合并 stream https://github.com/teambition/merge2
 * @param arg
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function merge2(...arg: any[]) {
  const streamsQueue = [];
  // eslint-disable-next-line prefer-rest-params
  const args = slice.call(arguments);
  let merging = false;
  let options = args[args.length - 1];

  if (options && !Array.isArray(options) && options.pipe == null) {
    args.pop();
  } else {
    options = {};
  }

  const doEnd = options.end !== false;
  const doPipeError = options.pipeError === true;
  if (options.objectMode == null) {
    options.objectMode = true;
  }
  if (options.highWaterMark == null) {
    options.highWaterMark = 64 * 1024;
  }
  const mergedStream = PassThrough(options);

  function addStream() {
    for (let i = 0, len = arguments.length; i < len; i++) {
      // eslint-disable-next-line prefer-rest-params
      streamsQueue.push(pauseStreams(arguments[i], options));
    }
    mergeStream();
    return this;
  }

  function mergeStream() {
    if (merging) {
      return;
    }
    merging = true;

    let streams = streamsQueue.shift();
    if (!streams) {
      process.nextTick(endStream);
      return;
    }
    if (!Array.isArray(streams)) {
      streams = [streams];
    }

    let pipesCount = streams.length + 1;

    function next() {
      if (--pipesCount > 0) {
        return;
      }
      merging = false;
      mergeStream();
    }

    function pipe(stream) {
      function onend() {
        stream.removeListener('merge2UnpipeEnd', onend);
        stream.removeListener('end', onend);
        if (doPipeError) {
          stream.removeListener('error', onerror);
        }
        next();
      }
      function onerror(err) {
        mergedStream.emit('error', err);
      }
      // skip ended stream
      if (stream._readableState.endEmitted) {
        return next();
      }

      stream.on('merge2UnpipeEnd', onend);
      stream.on('end', onend);

      if (doPipeError) {
        stream.on('error', onerror);
      }

      stream.pipe(mergedStream, { end: false });
      // compatible for old stream
      stream.resume();
    }

    for (let i = 0; i < streams.length; i++) {
      pipe(streams[i]);
    }

    next();
  }

  function endStream() {
    merging = false;
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain');
    if (doEnd) {
      mergedStream.end();
    }
  }

  mergedStream.setMaxListeners(0);
  mergedStream.add = addStream;
  mergedStream.on('unpipe', stream => {
    stream.emit('merge2UnpipeEnd');
  });

  if (args.length) {
    // eslint-disable-next-line prefer-spread
    addStream.apply(null, args);
  }
  return mergedStream;
}

/**
 *  Writable Demo
 */
export class ToWritable extends Writable {
  constructor() {
    super();
  }
  _write(data, enc, next) {
    process.stdout.write(data);
    process.nextTick(next);
  }
}
