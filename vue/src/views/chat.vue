<template>
  <div class="chat-box">
    <div class="contact-box">
      <el-input v-model="search" placeholder="搜索">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="onSearch">
        </i>
      </el-input>
      <ul class="contact-list">
        <li class="contact-item" :class="{avtive:userActive.id==item.id}" v-for="(item,index) in contactList"
          :key="index" @click="onCantact(item.id)">
          <div class="content-box">
            <img :src="item.avatar" alt="" class="avatar">
            <div class="info-box">
              <h2 class="username">{{item.nickname}}</h2>
              <p class="hot-news">{{item.message}}</p>
            </div>
          </div>
          <div class="time-box">12-10</div>
        </li>
      </ul>
    </div>
    <div class="chat-room-box">
      <div class="chat-top-box">
        <div class="user-box">
          <img :src="userActive.avatar" alt="" class="avatar">
          <h2>{{userActive.nickname}}</h2>
        </div>
        <div class="logout" @click="onLogout">退出登录</div>
      </div>
      <ul class="msg-box">
        <li class="msg-item" :class="{my:item.sender_id==userInfo.id}" v-for="(item,index) in chatList" :key="index">
          <img :src="item.sender_id==userInfo.id?userInfo.avatar:userActive.avatar" alt="" class="avatar">
          <div class="msg-info">
            <!-- <h5 class="username">刘德华</h5> -->
            <p class="msg-content">{{item.message}}</p>
          </div>
        </li>
      </ul>
      <div class="send-msg">
        <el-input class="text" type="textarea" v-model="sendConnent" placeholder="发送内容" :rows="4" resize="none">
        </el-input>
        <el-button type="primary" size="small" @click="onSend">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "chat",
  data() {
    return {
      search: "",
      contactList: [],
      userActive: {},
      chatList: [],
      sendConnent: "",
      ws: null,
    };
  },
  created() {
    this.getUserInfo();
    this.getContactList();
    this.onChatMsg();
  },
  destroyed() {
    this.ws.close(4054, "客户端关闭");
  },
  methods: {
    onChatMsg() {
      const token = localStorage.getItem("token");
      this.ws = new WebSocket(`ws://localhost:3000/chat/msg?token=${token}`);
      this.ws.onopen = (e) => {
        console.log("连接成功", e);
      };
      this.ws.onmessage = (res) => {
        console.log("接受消息", res);
        this.chatList.push(JSON.parse(res.data));
        this.autoScrollButoom();
      };
      this.ws.onclose = (e) => {
        console.log("连接关闭", e);
      };
      this.ws.onerror = (e, r) => {
        console.log("连接失败", e, r);
      };
    },
    onSend() {
      if (!this.sendConnent || this.sendConnent.match(/^\s+$/)) {
        return this.$message.error("不能发送空白内容");
      }
      const sendObj = {
        receive_id: this.userActive.id,
        sender_id: this.userInfo.id,
        message: this.sendConnent,
      };
      this.chatList.push(sendObj);
      this.ws.send(JSON.stringify(sendObj));
      this.autoScrollButoom();
      this.sendConnent = "";
    },
    getContactList() {
      this.$axios.get("/chat/contactList").then((res) => {
        this.contactList = res.data;
        this.userActive = this.contactList[0];
        this.getMsgList();
      });
    },
    onSearch() {},
    onCantact(id) {
      this.userActive = this.contactList.find((t) => t.id === id);
      this.getMsgList();
    },
    getUserInfo() {
      this.$axios.get("/user/userinfo").then((res) => {
        this.userInfo = res.data;
      });
    },
    autoScrollButoom() {
      this.$nextTick(() => {
        const chatList = this.$el.querySelector(".msg-box");
        const { scrollHeight } = chatList;
        chatList.scrollTop = scrollHeight;
      });
    },
    keyDown(e) {
      console.log(e);
      //   e.key === "Enter" && this.onSend();
    },
    getMsgList() {
      this.$axios
        .get("/chat/msgList", {
          params: {
            userid: this.userActive.id,
            pageIndex: 1,
            pageSize: 10,
          },
        })
        .then((res) => {
          this.chatList = res.data;
          // this.chatList.findLast((item) => {
          //   this.contactList.forEach((t) => {
          //     if (t.id == item.id) t.message = item.message;
          //   });
          // });
          this.autoScrollButoom();
        });
    },
    onLogout() {
      localStorage.clear();
      this.$confirm("是否退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.push({ name: "login" });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chat-box {
  display: flex;
}
.contact-box {
  padding: 20px;
  background-color: #ccc;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 10px #ccc;
}
.contact-list {
  width: 250px;
  padding-top: 10px;
  .contact-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    margin: 0 -20px;
    cursor: pointer;
    &.avtive {
      background-color: white;
    }
    .content-box {
      display: flex;
    }
    .info-box {
      flex: 1;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .username {
        font-size: 16px;
      }
      .hot-news {
        font-size: 14px;
        width: 140px;
        color: #666;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .time-box {
      font-size: 14px;
      color: #999;
    }
  }
}
.msg-box {
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 147px - 70px);
  padding: 20px;
  box-sizing: border-box;
  .msg-item {
    display: flex;
    margin-top: 10px;
    .msg-info {
      max-width: 40%;
      margin: 0 10px;
      .msg-content {
        border-radius: 10px;
        background-color: aqua;
        padding: 6px 10px;
        margin-top: 8px;
        box-shadow: 0 0 10px #ccc;
      }
    }
    &.my {
      flex-direction: row-reverse;
      .username {
        text-align: right;
      }
      .msg-content {
        background-color: pink;
      }
    }
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: #aaa;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // background: #ededed;
    border-radius: 10px;
  }
}
.chat-room-box {
  flex: 1;
  .chat-top-box {
    padding: 10px;
    padding-right: 20px;
    box-shadow: 0 0 10px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logout {
      cursor: pointer;
    }
  }
  .user-box {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 20px;
    }
  }
}
.send-msg {
  text-align: right;
  border-top: 1px solid #ccc;
  padding: 10px;
  //   width: 100%;
  .text {
    width: 100%;
    /deep/.el-textarea__inner {
      border: none;
    }
  }
}
</style>