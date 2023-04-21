class Memo {
    constructor(title, content, time, code) {
        this.title = title;
        this.content = content;
        this.time = time;
        this.code = code;
    }
}

class MemoList {
    constructor() {
        this.memoList = [];
    }

    getMemoList = function () {
        return this.memoList;
    };

    getMemo = function (index) {
        return this.memoList[index];
    };

    getSize = function () {
        return this.memoList.length;
    };

    getIndex = function (code) {
        return this.memoList.indexOf(this.memoList.filter((el) => el.code === code)[0]);
    };

    addMemo = function (title, content, time, code) {
        return this.memoList.push(new Memo(title, content, time, code));
    };

    delMemo = function (code) {
        return this.memoList.splice(this.getIndex(code), 1);
    };

    changeTitle = function (code, newTitle) {
        return (this.memoList[this.getIndex(code)].title = newTitle);
    };

    changeContent = function (code, newContent) {
        return (this.memoList[this.getIndex(code)].content = newContent);
    };
}

// let a = new MemoList();

// a.addMemo("a0", "b0", "c0", 0);
// a.addMemo("a1", "b1", "c1", 1);
// a.addMemo("a2", "b2", "c2", 2);
// a.addMemo("a3", "b3", "c3", 3);
// a.addMemo("a4", "b4", "c4", 4);

// console.log(a.getMemoList());
// console.log(a.delMemo(2));
// console.log(a.getMemoList());
// console.log(a.getSize());

// console.log(a.changeTitle(0, "a000"));
// console.log(a.changeContent(0, "aaa000"));

// console.log(a.getMemoList());
