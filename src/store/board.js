import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", {
  state: () => {
    return {
      // 版块信息
      boardList: [],
      //当前一级版块
      activePBoardId: 0,
      //当前二级板块
      activeBoardId: 0,
    };
  },
  //getters不能传递参数
  getters: {
    getBoardList() {
      return this.boardList;
    },
    getSubBoardList() {
      return (boardId) => {
        const board = this.boardList.find(
          (item) => item.boardId === parseInt(boardId)
        );
        return board ? board.children : [];
      };
    },
  },
  actions: {
    saveBoardList(value) {
      this.boardList = value;
    },
  },
});
