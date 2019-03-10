<template>
    <div style="background:#eee;padding: 20px">
        <Card :bordered="false">
            <p slot="title">3D 应用</p>
            <p>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="名称">
                        <Input v-model="formItem.input" placeholder="Enter something..."></Input>
                    </FormItem>
                    <FormItem label="描述">
                        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
                    <FormItem label="影像">
                        <Select v-model="formItem.imageProvider">
                            <Option value="vect_c.tianditu.cn">天地图矢量</Option>
                            <Option value="img_c.tianditu.cn">天地图影像</Option>
                            <Option value="google.cn">谷歌影像</Option>
                            <Option value="arcgisonline.com">ArcGIS影像底图</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="地形">
                        <Select v-model="formItem.terrainProvider">
                            <Option value="Ellipsoid">基础地形</Option>
                            <Option value="agi.com">STK影像</Option>
                            <Option value="shanghai">London</Option>
                            <Option value="shenzhen" @click="alert('')">新建...</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="模型">
                        <Select v-model="formItem.select" @on-change="selectIt">
                            <Option value="beijing">[内置]</Option>
                            <Option value="shanghai">London</Option>
                            <Option value="new...">新建...</Option>
                             <Button slot="append" icon="ios-search"></Button>
                        </Select>
                       
                    </FormItem>
                </Form>
                <br>

                <Row type="flex" justify="space-between" class="code-row-bg">
                    <Col span="24" style="text-align: right">
                    <ButtonGroup size="large" shape="circle">
                        <Button type="primary">
                            <Icon type="ios-arrow-back" />
                            Backward
                        </Button>
                        <Button type="primary" @click="next">
                            下一步
                            <Icon type="ios-arrow-forward" />
                        </Button>
                    </ButtonGroup>
                    </Col>
                </Row>
            </p>
        </Card>

        <h2 style="text-align: center">3D 应用</h2>
        <Divider />

        <Form :model="formItem" :label-width="80">
            <FormItem label="名称">
                <Input v-model="formItem.input" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="描述">
                <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="影像">
                <Select v-model="formItem.select">
                    <Option value="beijing">[内置]</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">新建...</Option>
                </Select>
            </FormItem>
            <FormItem label="地形">
                <Select v-model="formItem.select">
                    <Option value="beijing">[内置]</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">新建...</Option>
                </Select>
            </FormItem>
            <FormItem label="模型">
                <Select v-model="formItem.select" >
                    <Option value="beijing">[内置]</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen" >新建...</Option>
                </Select>
            </FormItem>
        </Form>
        <Divider />

        <Form :model="formItem" :label-width="80">
            <FormItem label="Input">
                <Input v-model="formItem.input" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="Select">
                <Select v-model="formItem.select">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="DatePicker">
                <Row>
                    <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                    <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Radio">
                <RadioGroup v-model="formItem.radio">
                    <Radio label="male">Male</Radio>
                    <Radio label="female">Female</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Checkbox">
                <CheckboxGroup v-model="formItem.checkbox">
                    <Checkbox label="Eat"></Checkbox>
                    <Checkbox label="Sleep"></Checkbox>
                    <Checkbox label="Run"></Checkbox>
                    <Checkbox label="Movie"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="Switch">
                <i-switch v-model="formItem.switch" size="large">
                    <span slot="open">On</span>
                    <span slot="close">Off</span>
                </i-switch>
            </FormItem>
            <FormItem label="Slider">
                <Slider v-model="formItem.slider" range></Slider>
            </FormItem>
            <FormItem label="Text">
                <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
                <Button type="primary">Submit</Button>
                <Button style="margin-left: 8px">Cancel</Button>
            </FormItem>
        </Form>

        <Modal v-model="modal1" title="Common Modal dialog box title">
        <p>Content of dialog</p>
        <p>    <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.11com/posts/">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click or drag files here to upload</p>
        </div>
    </Upload>
        </p>
    </Modal>
    </div>

    
</template>

<script>
export default {
  name: "",
  data() {
    return {
        modal1: false,
      formItem: {
          imageProvider: "",
          terrainProvider: "",
          
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      }
    };
  },
  methods: {
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            selectIt (option) {
                if (option == 'new...')
                this.modal1 = true;
            },
            next(){
                this.$router.push({ path: '/app-3d', query: this.formItem})
            }
        }
};
</script>

<style lang="" scoped>
</style>