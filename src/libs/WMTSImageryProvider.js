import Cesium from 'cesium/Cesium';
var WMTSImageryProvider = function(urlformat, addone, description) {
    var defaultCredit = new Cesium.Credit('WMTS');
    description = Cesium.defaultValue(description, {});
    this._tilingScheme = new Cesium.WebMercatorTilingScheme({
        numberOfLevelZeroTilesX: 1,
        numberOfLevelZeroTilesY: 1
    });
    this._tileWidth = 256;
    this._tileHeight = 256;
    this._fileExtension = Cesium.defaultValue(description.fileExtension, 'png');
    this._tileDiscardPolicy = description.tileDiscardPolicy;
    this._minimumLevel = 0;
    this._maximumLevel = 19;
    this._extent = Cesium.defaultValue(description.extent, this._tilingScheme.extent);
    this._rectangle = Cesium.defaultValue(description.rectangle, this._tilingScheme.rectangle);
    this._ready = true;
    this.baseurl = urlformat;
    this.needaddone = addone;
    var credit = Cesium.defaultValue(description.credit, defaultCredit);
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit)
    }
    this._credit = credit
};
WMTSImageryProvider.prototype.requestImage = function(x, y, level) {
    if (this.needaddone) {
        x += 1;
        y += 1;
        level += 1
    }
    if (this.baseurl.indexOf("google") > 0) {
        x -= 1;
        y -= 1;
        level -= 1
    }
    if (this.baseurl.indexOf("2002") > 0) {
        y -= 1;
        x -= 1;
        level -= 1
    }
    //zzz = level;
    var url = this.baseurl.replace("{x}", x);
    url = url.replace("{y}", y);
    url = url.replace("{z}", level);
    return Cesium.ImageryProvider.loadImage(this, url)
}
;
Object.defineProperties(WMTSImageryProvider.prototype, {
    tileWidth: {
        get: function() {
            return this._tileWidth
        }
    },
    tileHeight: {
        get: function() {
            return this._tileHeight
        }
    },
    defaultAlpha: {
        get: function() {
            return 1
        }
    },
    hasAlphaChannel: {
        get: function() {
            return true
        }
    },
    maximumLevel: {
        get: function() {
            return this._maximumLevel
        }
    },
    minimumLevel: {
        get: function() {
            return this._minimumLevel
        }
    },
    tilingScheme: {
        get: function() {
            return this._tilingScheme
        }
    },
    extent: {
        get: function() {
            return this._extent
        }
    },
    rectangle: {
        get: function() {
            return this._rectangle
        }
    },
    ready: {
        get: function() {
            return this._ready
        }
    }
});
export default WMTSImageryProvider;
