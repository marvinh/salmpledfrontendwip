import lamejs from "lamejs";

export function encodeMono(channels, sampleRate, samples) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var maxSamples = 1152;
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var mono = samples.subarray(i, i + maxSamples);
        var mp3buf = mp3enc.encodeBuffer(mono);
        if (mp3buf.length > 0) {
            buffer.push(new Int8Array(mp3buf));
        }
        remaining -= maxSamples;
    }
    var d = mp3enc.flush();
    if (d.length > 0) {
        buffer.push(new Int8Array(d));
    }

    console.log('done encoding, size=', buffer.length);
    var blob = new Blob(buffer, { type: 'audio/mp3' });
    return blob
}
export function FloatArray2Int16(floatbuffer, offset, length) {
    var int16Buffer = new Int16Array(floatbuffer.length, offset, length);
    for (var i = 0, len = floatbuffer.length; i < len; i++) {
        if (floatbuffer[i] < 0) {
            int16Buffer[i] = 0x8000 * floatbuffer[i];
        } else {
            int16Buffer[i] = 0x7FFF * floatbuffer[i];
        }
    }
    return int16Buffer;
}

export function encodeStereo(channels, sampleRate, samples) {
    var mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var mp3Data = [];
    var remaining = samples.length;
    var maxSamples = 1152;

    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var leftChunk = [];
        var rightChunk = [];
        for (var j = i; j < (i + maxSamples); j += 2) {
            leftChunk.push(samples[j]);
            rightChunk.push(samples[j + 1]);
        }
        var mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }
        console.log(remaining);
        remaining -= maxSamples;
    }
    mp3buf = mp3encoder.flush();   //finish writing mp3

    if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
    }
    console.log('done encoding, size=', mp3Data.length);
    var blob = new Blob(mp3Data, { type: 'audio/mp3' });
    return blob
}
