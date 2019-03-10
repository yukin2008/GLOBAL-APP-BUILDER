import Cesium from 'cesium/Cesium';
var TDTWMTSImageProvider = function TDTWMTSImageProvider(urlformat, addone, minlevel, maxlevel, description, leveldiv, urlformat2) {
    var defaultCredit = new Cesium.Credit('WMTS');
    description = Cesium.defaultValue(description, {});
    this._7 = new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
    });
    this._3 = 256;
    this._4 = 256;
    this._10 = Cesium.defaultValue(description.fileExtension, 'jpg');
    this._9 = description.proxy;
    this._12 = description.tileDiscardPolicy;
    this._2 = minlevel;
    this._1 = maxlevel;
    this._8 = new Cesium.Rectangle(0 - Math.PI, 0 - Math.PI / 2, Math.PI, Math.PI / 2);
    this._5 = new Cesium.Rectangle(0 - Math.PI, 0 - Math.PI / 2, Math.PI, Math.PI / 2);
    this._6 = true;
    this.baseurl = urlformat;
    this.needaddone = addone;
    if (leveldiv) {
        this._0 = leveldiv;
        this.baseurl2 = urlformat2
    }
    var credit = Cesium.defaultValue(description.credit, defaultCredit);
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit)
    }
    this._11 = credit
};
Cesium.defineProperties(TDTWMTSImageProvider.prototype, {
    tileWidth: {
        get: function () {
            return this._3
        }
    },
    tileHeight: {
        get: function () {
            return this._4
        }
    },
    defaultAlpha: {
        get: function () {
            return 1
        }
    },
    hasAlphaChannel: {
        get: function () {
            return true
        }
    },
    maximumLevel: {
        get: function () {
            return this._1
        }
    },
    minimumLevel: {
        get: function () {
            return this._2
        }
    },
    tilingScheme: {
        get: function () {
            return this._7
        }
    },
    extent: {
        get: function () {
            return this._8
        }
    },
    rectangle: {
        get: function () {
            return this._5
        }
    },
    ready: {
        get: function () {
            return this._6
        }
    },
    minimumTerrainLevel: {
        get: function () {
            return 0
        }
    },
    maximumTerrainLevel: {
        get: function () {
            return 17
        }
    }
});
TDTWMTSImageProvider.prototype.requestImage = function (x, y, level) {
    if (this.needaddone) {
        x += 1;
        y += 1;
        level += 1
    }
    var tempurl = this.baseurl;
    if (this._0) if (level > this._0) tempurl = this.baseurl2;
    var url = tempurl.replace("{x}", x);
    url = url.replace("{l}", y % 8);
    url = url.replace("{y}", y);
    url = url.replace("{z}", level + 1);
    return Cesium.ImageryProvider.loadImage(this, url)
};
export default TDTWMTSImageProvider;