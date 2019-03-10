<style scoped lang="less">
.list {
  .col {
    padding: 10px 20px 10px 20px;
  }
}
</style>
<template>
    <div class="list" style="background:#eee;padding:20px">

        <Row :gutter="16">
            <Col class="col" :xs="24" :sm="12" :md="6" :lg="6">
           <router-link to="/create">
                <Card>
                    <div style="text-align:center">
                        <h3>
                            <Icon type="ios-add" size="40" />
                        </h3>
                    </div>
                </Card>
           </router-link>
            </Col>
            <Col class="col" :xs="24" :sm="12" :md="6" :lg="6">
            <Card>
                <p slot="title">No border title</p>
                <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
            </Card>
            </Col>
            <Col class="col" :xs="24" :sm="12" :md="6" :lg="6">
            <Card :bordered="false">
                <p slot="title">No border title</p>
                <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  methods: {
    handleCreate() {
    //   this.$Modal.info({
    //     title: "Bravo",
    //     content: "Now, enjoy the convenience of iView."
    //   });
    this.$router.push('/create')
    }
  }
};
</script>
