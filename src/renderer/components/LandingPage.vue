<template>
  <div id="wrapper">
    <div class="header">
      <img
        id="logo"
        class="logo"
        src="~@/assets/coldroom-reverse.png"
        alt="coldroom"
      />
      <p class="title">
        Coldroom Temperature Board configurations
      </p>
    </div>
    <div class="main input-form">
      <input
        type="file"
        ref="file"
        style="display: none"
        @change="handlechageMain"
      />
      <p class="file-label">MAIN FILE : {{ mainFileName }}</p>
      <button class="input-btn" @click="$refs.file.click()">
        Choose file
      </button>
    </div>
    <div class="main input-form">
      <input
        type="file"
        ref="partitions"
        style="display: none"
        @change="handlechagePartitions"
      />
      <p class="file-label">PARTITIONS : {{ partitionsName }}</p>
      <button class="input-btn" @click="$refs.partitions.click()">
        Choose file
      </button>
    </div>
    <div class="upload-section">
      <button class="checkport-btn" @click="checkport">
        Check Port
      </button>
      <Multiselect
        class="selector"
        v-model="value"
        :options="options"
        selectLabel="SELECT"
        deselect-label="REMOVE"
        @input="onChange"
      ></Multiselect>
    </div>
    <div class="main">
      <button :disabled="isDisable" class="upload-btn" @click="upload">
        <span v-if="!loading">Upload</span>
        <span v-else><RingLoader :size="30" color="white"/></span>
      </button>
    </div>
    <div class="main">
      {{ uploadMsg }}
    </div>
    <div v-if="uploadMsg" class="main">
      <button class="reset-btn" @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import Multiselect from "vue-multiselect";
import { mapState } from "vuex";
import { RingLoader } from "vue-spinners-css";

export default {
  name: "landing-page",
  components: { SystemInformation, Multiselect, RingLoader },
  data() {
    return {
      mainFileName: "",
      partitionsName: "",
      value: "",
      options: [],
    };
  },
  computed: {
    ...mapState({
      comPort: (state) => state.Counter.comPort,
      loading: (state) => state.Counter.uploading,
      uploadMsg: (state) => state.Counter.uploadMsg,
    }),
    isDisable() {
      if (
        this.mainFileName !== "" &&
        this.partitionsName !== "" &&
        this.value !== "" &&
        this.value !== null
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    handlechageMain(event) {
      let file = event.target.files[0];
      console.log(file);
      this.mainFileName = file.name ? file.name : "";
      this.$store.commit("SET_MAIN_FILE", file.name);
    },
    handlechagePartitions(event) {
      let file = event.target.files[0];
      console.log(file);
      this.partitionsName = file.name ? file.name : "";
      this.$store.commit("SET_PARTITIONS_FILE", file.name);
    },
    async checkport() {
      await this.$store.dispatch("sendExec");
      this.options = this.comPort;
      console.log(this.comPort);
    },
    async upload() {
      this.$store.dispatch("upload");
    },
    async reset() {
      this.$store.commit("SET_MAIN_FILE", "");
      this.$store.commit("SET_PARTITIONS_FILE", "");
      this.$store.commit("SET_COM_SELECTED", "");
      this.mainFileName = "";
      this.partitionsName = "";
      this.value = "";
      this.$store.commit("SET_UPLOADING", false);
      this.$store.commit("SET_UPLOAD_MSG", "");
    },
    onChange() {
      console.log(this.value);
      this.$store.commit("SET_COM_SELECTED", this.value);
    },
  },
  created() {
    this.$store.dispatch("sendExec");
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

.header {
  /* display: flex; */
  flex-direction: row;
  text-align: center;
}

.selector {
  width: 240px;
  margin-left: 10px;
}

.main {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.upload-section {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.file-label {
  margin-right: -10px;
  width: 400px;
  height: 40px;
  border: 1px solid #e8e8e8;
  padding: 8px 10px 8px 5px;
  border-radius: 5px;
}

.checkport-btn {
  width: 250px;
  margin-right: 10px;
  padding: 5px 20px 7px 20px;
  color: white;
  background-color: #2c323f;
  border-radius: 5px;
  border: 1px solid #2c323f;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.upload-btn {
  height: 40px;
  width: 250px;
  margin-right: 10px;
  padding: 5px 20px 7px 20px;
  color: white;
  background-color: #1976d2;
  border-radius: 5px;
  border: 1px solid #1976d2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.upload-btn:disabled {
  height: 40px;
  width: 250px;
  margin-right: 10px;
  padding: 5px 20px 7px 20px;
  color: white;
  background-color: #557ba1;
  border-radius: 5px;
  border: 1px solid #557ba1;
  font-size: 14px;
  font-weight: 600;
  cursor: not-allowed;
}

.reset-btn {
  height: 40px;
  width: 100px;
  margin-right: 10px;
  padding: 5px 20px 7px 20px;
  color: white;
  background-color: #c10015;
  border-radius: 5px;
  border: 1px solid #c10015;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.input-btn {
  padding: 5px 20px 7px 20px;
  color: white;
  background-color: #2c323f;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #2c323f;
  font-size: 14px;
  font-weight: 600;
}

.title {
  color: #2c3e50;
  font-size: 32px;
  font-weight: bold;
  margin-top: 0px;
  margin-left: 30px;
}

.logo {
  margin-top: 20px;
  max-width: 115px;
  max-height: 130px;
}
</style>
