import { execPath } from "process";

const state = {
  mainFile: "",
  partitions: "",
  comPort: [],
  comSelected: "",
  uploading: false,
  uploadMsg: "",
};

const mutations = {
  SET_COM_SELECTED(state, com) {
    state.comSelected = com;
  },
  SET_MAIN_FILE(state, main) {
    state.mainFile = main;
  },
  SET_PARTITIONS_FILE(state, partitions) {
    state.partitions = partitions;
  },
  SET_UPLOADING(state, status) {
    state.uploading = status;
  },
  SET_UPLOAD_MSG(state, msg) {
    state.uploadMsg = msg;
  },
  async SET_COMPORT_DATA(state, payload) {
    state.comPort = [];
    let n = 0;
    let i = 0;
    let res = [];
    while (n >= 0) {
      n = payload.search("\n");
      res[i] = payload.substring(0, n);
      payload = payload.substring(n + 1);
      if (res[i].length > 0) {
        state.comPort.push(res[i].substring(0, 4));
      }
      i = i + 1;
    }
  },
};

const actions = {
  async sendExec({ commit, state }, payload) {
    let stdout = await exectest();
    console.log("STDOUT : ", stdout);
    commit("SET_COMPORT_DATA", stdout);
  },
  async upload({ commit, state }, payload) {
    // commit("SET_UPLOADING", true);
    await uploadCode(state.comSelected, state.mainFile, state.partitions);
    // commit("SET_UPLOADING", false);
  },
};

export default {
  state,
  mutations,
  actions,
};

let inString = "";
const { exec } = require("child_process");

async function exectest() {
  exec("chgport", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    inString = stdout;
  });
  return inString;
}

async function uploadCode(port, main, partitions) {
  state.uploading = true;
  const headerCommand = `esptool.exe --chip esp32 --port ${port} --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect`;
  const bootloaderCommand = ` 0xe000 boot_app0.bin 0x1000 bootloader_qio_80m.bin`;
  const codeCommand = ` 0x10000 ${main} 0x8000 ${partitions}`;
  const command = headerCommand + bootloaderCommand + codeCommand;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("STD", stdout);
    if (stdout.length > 200) {
      state.uploading = false;
      state.uploadMsg = "Upload Done !";
    }
  });
}
