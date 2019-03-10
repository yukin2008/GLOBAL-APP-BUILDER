
<style scoped lang="less">
.builder {
  #cesiumContainer {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
  #toolbar {
    display: block;
    position: absolute;
    top: 5px;
    .stick-btn {
      border-radius: 0 50% 50% 0;
    }
  }
}
</style>
<style lang="less">
#configDrawer {
  .ivu-drawer-body {
    padding: 0;
  }
  .ivu-collapse {
    border-radius: 0;
  }
  .ivu-cell {
    padding: 7px 7px;
  }
}
</style>
<template>
  <div class="builder">
    <div id="cesiumContainer"></div>
    <div id="toolbar">
      <Button
        class="stick-btn"
        type="primary"
        shape="circle"
        icon="md-build"
        @click="drawerOpen = true"
      ></Button>
    </div>
    <Drawer
      title="3D场景设置"
      placement="left"
      :closable="false"
      v-model="drawerOpen"
      id="configDrawer"
      :scrollable="false"
    >
      <Collapse
        v-model="panelOpen"
        accordion
      >
        <Panel name="terrain">
          地形
          <p slot="content">
            <RadioGroup
              v-model="terrainProvider"
              @on-change="terrainProviderChanged"
              vertical
            >
              <Radio
                v-for="item in terrainProviderOptions"
                :label="item.value"
              >
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </p>
        </Panel>
        <Panel name="imagery">
          影像
          <p slot="content">

             <Button long icon="ios-add" @click="showImageryLib=true"></Button> 

            <CheckboxGroup
              v-model="imageryProviders"
              @on-change="imageryProviderChanged"
            >
              <CellGroup>

                <SlickList
                  lockAxis="y"
                  v-model="imageryProviderOptions"
                  appendTo=".ivu-drawer-wrap"
                >

                  <SlickItem
                    v-for="(item, index) in imageryProviderOptions"
                    :index="index"
                    :key="item.label"
                  >
                    <Cell>
                      <Checkbox :label="item.label">

                      </Checkbox>
                      <Dropdown
                        :transfer="true"
                        slot="extra"
                      >
                        <a href="javascript:void(0)">
                          <Icon
                            type="md-arrow-dropdown"
                            size="24"
                          />
                        </a>
                        <DropdownMenu slot="list">
                          <div style="width:200px;padding:20px 25px">
                            透明度 <Slider v-model="value1"></Slider>
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </Cell>

                  </SlickItem>

                </SlickList>

                <Cell selected>
                  <Checkbox
                    label="标注"
                    style="margin-right: 0"
                  >
                  </Checkbox>
                  <Select
                    v-model="labelImagery"
                    :transfer="true"
                    style="width: 120px"
                  >
                    <Option
                      v-for="item in labelImageryOptions"
                      :value="item.label"
                      :key="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                  <Dropdown
                    :transfer="true"
                    slot="extra"
                  >
                    <a href="javascript:void(0)">
                      <Icon
                        type="md-arrow-dropdown"
                        size="24"
                      />
                    </a>
                    <DropdownMenu slot="list">
                      <div style="width:200px;padding:20px 25px">
                        透明度 <Slider v-model="value1"></Slider>
                      </div>
                    </DropdownMenu>
                  </Dropdown>

                </Cell>
                <Cell selected>
                  <Checkbox
                    label="基础"
                    style="margin-right: 0"
                  >
                  </Checkbox>
                  <Select
                    v-model="basicImagery"
                    :transfer="true"
                    style="width: 120px"
                  >
                    <Option
                      v-for="item in basicImageryOptions"
                      :value="item.label"
                      :key="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                  <Dropdown
                    :transfer="true"
                    slot="extra"
                  >
                    <a href="javascript:void(0)">
                      <Icon
                        type="md-arrow-dropdown"
                        size="24"
                      />
                    </a>
                    <DropdownMenu slot="list">
                      <div style="width:200px;padding:20px 25px">
                        透明度 <Slider v-model="value1"></Slider>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </Cell>
              </CellGroup>
            </CheckboxGroup>
          </p>
        </Panel>
      </Collapse>
    </Drawer>


    <Drawer title="影像库" 
    :closable="false" 
    v-model="showImageryLib">
            <Form>
               
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="value3 = false">Cancel</Button>
                <Button type="primary" @click="value3 = false">Submit</Button>
            </div>
    </Drawer>

    <Modal
          v-model="showImageryLib1"
          title="影像库"
          :styles="{top: '20px'}"
          @on-ok="ok"
          @on-cancel="cancel">
          <p style="height:300px; overflow: scroll-y;">
       </p>
    </Modal>

  </div>


</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";
import TDTWMTSImageProvider from "../libs/TDTWMTSImageProvider";
import WMTSImageryProvider from "../libs/WMTSImageryProvider";
import { ContainerMixin, ElementMixin } from "vue-slicksort";
import { SlickList, SlickItem } from "vue-slicksort";

const SortableList = {
  mixins: [ContainerMixin],
  template: `
    <ul class="list">
      <slot />
    </ul>
  `
};

const SortableItem = {
  mixins: [ElementMixin],
  props: ["item"],
  template: `
    <li class="list-item">{{item}}</li>
  `
};

export default {
  name: "cesiumViewer",
  components: {
    SortableItem,
    SortableList,
    SlickItem,
    SlickList
  },
  data() {
    return {
      showImageryLib: false,
      value1: null,
      labelImagery: "ArcGIS基础",
      basicImagery: "Google",
      labelImageryOptions: [
        {
          label: "ArcGIS基础",
          value: new Cesium.ArcGisMapServerImageryProvider({
            url:
              "http://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer"
          })
        },
        {
          label: "天地图",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtImgAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        }
      ],
      basicImageryOptions: [
        {
          label: "Google",
          value: new WMTSImageryProvider(
            "http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}"
          )
        },
        {
          label: "ArcGIS",
          value: new Cesium.ArcGisMapServerImageryProvider({
            url:
              "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          })
        },
        {
          label: "天地图",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtImgBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        },
        {
          label: "天地图-全球矢量",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        },
        {
          label: "天地图-全球影像",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        },
        {
          label: "天地图-全球影像中文注记",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        },
        {
          label: "天地图-全球矢量中文注记",
          value: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible"
          })
        }
      ],
      model1: "",
      colors: [
        {
          text: "Aquamarine"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        },
        {
          text: "Burlywood"
        }
      ],
      items: [
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
        "Item 6",
        "Item 7",
        "Item 8"
      ],
      drawerOpen: false,
      panelOpen: "",
      terrainProvider: "Ellipsoid",
      terrainProviderOptions: [
        { label: "基础地形", value: "Ellipsoid" },
        { label: "Cesium地形", value: "CesiumWorld" },
        { label: "VR地形", value: "VRTheWorld" },
        { label: "谷歌地形", value: "GoogleEarth" }
      ],
      imageryProviders: [],
      imageryProviderOptions: [
        {
          label: "Cesium.Ion",
          value: new Cesium.IonImageryProvider({ assetId: 3812 })
        },
        {
          label: "osm ",
          value: Cesium.createOpenStreetMapImageryProvider({
            url: "https://a.tile.openstreetmap.org/"
          })
        },
        {
          label: "mbox  ",
          value: new Cesium.MapboxImageryProvider({
            mapId: "mapbox.satellite"
          })
        },
        {
          label: "Esri影像",
          value: new Cesium.ArcGisMapServerImageryProvider({
            url:
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          })
        }
      ]
    };
  },
  mounted() {
    console.log(this.$route.query.imageProvider);
    //var viewer = new Cesium.Viewer("cesiumContainer");
    var _0 = new Cesium.CesiumTerrainProvider({
        url: "//assets.agi.com/stk-terrain/world",
        isGoogleCustom: !0
      }),
      localterrainprovider = new Cesium.ProviderViewModel({
        name: "谷歌地球DEM",
        tooltip: "谷歌地球DEM",
        iconUrl: "http://api.rivermap.cn/cesium/Images/serverlayer.png",
        creationFunction: function() {
          return _0;
        }
      }),
      localterrainprovider1 = new Cesium.ProviderViewModel({
        name: "Cesium地形",
        tooltip: "Cesium地形",
        iconUrl: "http://api.rivermap.cn/cesium/Images/serverlayer.png",
        creationFunction: function() {
          // return new Cesium.CesiumTerrainProvider({
          //     url: "//assets.agi.com/stk-terrain/world",
          //     requestVertexNormals: !0
          // })
          return Cesium.createWorldTerrain();
        }
      }),
      localterrainprovider2 = new Cesium.ProviderViewModel({
        name: "PAMAP地形",
        tooltip: "PAMAP地形",
        iconUrl: "http://api.rivermap.cn/cesium/Images/serverlayer.png",
        creationFunction: function() {
          return new Cesium.CesiumTerrainProvider({
            url: "//assets.agi.com/stk-terrain/v1/tilesets/PAMAP/tiles"
          });
        }
      }),
      localterrainprovider3 = new Cesium.ProviderViewModel({
        name: "基础地形",
        tooltip: "基础地形地形",
        iconUrl: "http://api.rivermap.cn/cesium/Images/serverlayer.png",
        creationFunction: function() {
          return new Cesium.EllipsoidTerrainProvider();
        }
      }),
      localterrainprovider4 = new Cesium.ProviderViewModel({
        name: "离线高程",
        tooltip: "离线叠加高程",
        iconUrl: "http://api.rivermap.cn/cesium/Images/serverlayer.png",
        creationFunction: function() {
          return new Cesium.CesiumTerrainProvider({
            url: ipConfig + ":2001/dem",
            requestVertexNormals: !0
          });
        }
      }),
      labellayer = new TDTWMTSImageProvider(
        "http://t{l}.tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        !1,
        1,
        16,
        {
          alpha: 0
        }
      ),
      tiandituProviderPlaceName = new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts",
        layer: "cia",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "w",
        maximumLevel: 19,
        credit: new Cesium.Credit("天地图")
      }),
      imageprovider_my = new WMTSImageryProvider(
        "http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}",
        !0,
        {
          alpha: 1
        }
      ),
      localterrainprovider_my = new Cesium.CesiumTerrainProvider({
        url: "//assets.agi.com/stk-terrain/world",
        requestVertexNormals: !0
      });
    var options = {
      animation: false, //是否显示动画控件
      homeButton: true, //是否显示home键
      //geocoder:false,         //是否显示地名查找控件        如果设置为true，则无法查询
      baseLayerPicker: true, //是否显示图层选择控件
      timeline: false, //是否显示时间线控件
      fullscreenButton: true, //是否全屏显示
      scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      infoBox: true, //是否显示点击要素之后显示的信息
      sceneModePicker: false, //是否显示投影方式控件  三维/二维
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false, //是否显示帮助信息控件
      selectionIndicator: false, //是否显示指示器组件
      // imageryProviderViewModels: [
      //   imageprovider,
      //   imageprovider1,
      //   imageprovider2,
      //   imgarcgisprovider,
      //   imgarcgisprovider1
      // ],
      terrainProviderViewModels: [
        localterrainprovider,
        localterrainprovider1,
        localterrainprovider2,
        localterrainprovider3
      ],
      // selectedImageryProviderViewModel: imageprovider,
      selectedTerrainProviderViewModel: localterrainprovider1,
      navigationHelpButton: !0,
      showRenderLoopErrors: !1,
      fullscreenElement: document.documentElement,
      mapProjection: new Cesium.WebMercatorProjection()
    };
    // options =  {
    //                  imageryProviderViewModels: [imageprovider, imageprovider1, imageprovider2, imgarcgisprovider, imgarcgisprovider1],
    //     terrainProviderViewModels: [localterrainprovider, localterrainprovider1, localterrainprovider2, localterrainprovider3],
    //     selectedImageryProviderViewModel: imageprovider,
    //     selectedTerrainProviderViewModel: localterrainprovider1,
    // };
    var viewer = new Cesium.Viewer("cesiumContainer", options);
    viewer._cesiumWidget._creditContainer.style.display = "none";
    //viewer1.scene.imageryLayers.addImageryProvider(tiandituProviderPlaceName);
    viewer.scene.globe.depthTestAgainstTerrain = !0;
    this.viewer = viewer;

    // measureSurface = new mars3d.Measure({
    //     viewer: viewer,
    //     terrain: !1
    // });
    // var CesiumEditor = new CesiumEditManger(viewer);
    // CesiumEditor.init(),
    // flytochina(viewer),
    // showskyBox(viewer),
    // $(".cesium-viewer-bottom").hide(),
    // $(".cesium-viewer-fullscreenContainer").hide(),
    // $(".cesium-viewer-animationContainer").hide();
  },
  methods: {
    terrainProviderChanged: function() {
      let terrainProvider = this.viewer.terrainProvider;
      switch (this.terrainProvider) {
        case "Ellipsoid":
          terrainProvider = new Cesium.EllipsoidTerrainProvider();
          break;
        case "CesiumWorld":
          terrainProvider = Cesium.createWorldTerrain();
          break;
        case "VRTheWorld":
          terrainProvider = new Cesium.VRTheWorldTerrainProvider({
            url: "https://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/"
          });
          break;
        case "GoogleEarth":
          var geeMetadata = new Cesium.GoogleEarthEnterpriseMetadata(
            "http://www.earthenterprise.org/3d"
          );
          terrainProvider = new Cesium.GoogleEarthEnterpriseTerrainProvider({
            metadata: geeMetadata
          });
          break;
      }
      this.viewer.terrainProvider = terrainProvider;
    },
    imageryProviderChanged: function() {
      let imageryLayers = this.viewer.imageryLayers;
      imageryLayers.removeAll();

      let imageProviders = this.imageryProviders;
      for (var i = 0; i < imageProviders.length; i++) {
        let label = imageProviders[i];
        let prividers = [];
        if (label == "基础") {
          prividers = this.basicImageryOptions.filter(item => {
            return item.label == this.basicImagery;
          });
        } else if (label == "标注") {
          prividers = this.labelImageryOptions.filter(item => {
            return item.label == this.labelImagery;
          });
        } else {
          prividers = this.imageryProviderOptions.filter(item => {
            return item.label == label;
          });
        }

        prividers.forEach(item => {
          let layer = imageryLayers.addImageryProvider(item.value);
          layer.name = item.label;
        });
      }
    },
    imageryProvidersSortChanged: function(newList) {}
  }
};
</script>