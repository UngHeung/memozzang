class Memo {
    constructor(title, content, code) {
        this.title = title;
        this.time = this.setDate().toString();
        this.content = content;
        this.code = code;

        this.date = this.setDate();
    }

    setDate = function () {
        const today = new Date();
        let date = [];
        date.push(today.getFullYear());
        date.push(today.getMonth() + 1);
        date.push(today.getDate());
        date.push(`${today.getHours()}:${today.getMinutes()}`);
        return date;
    };

    getDate = function () {
        return this.date;
    };
}

class MemoList {
    constructor() {
        this.memoList = JSON.parse(localStorage.getItem("memoList"));
        this.memoList = this.memoList ?? [];
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

    addMemo = function (title, content, code) {
        this.memoList.push(new Memo(title, content, code));
        this.setLocalStorage();
        return this.memoList[this.getSize() - 1];
    };

    delMemo = function (code) {
        const result = this.memoList.splice(this.getIndex(code), 1);
        this.setLocalStorage();
        return result;
    };

    popMemo = function () {
        const result = this.memoList.pop();
        this.setLocalStorage();
        return result;
    };

    shiftMemo = function () {
        const result = this.memoList.shift();
        this.setLocalStorage();
        return result;
    };

    setLocalStorage = function () {
        localStorage.setItem("memoList", JSON.stringify(this.memoList));
    };

    clearMemo = function () {
        this.memoList.splice(0, this.memoList.length);
        localStorage.clear();
    };

    // changeTitle = function (code, newTitle) {
    //     return (this.memoList[this.getIndex(code)].title = newTitle);
    // };

    // changeContent = function (code, newContent) {
    //     return (this.memoList[this.getIndex(code)].content = newContent);
    // };
}

/*  */
const title = document.getElementById("input_title");
const content = document.getElementById("input_content");
const contentLength = document.querySelector(".content-length");
const dispMemoLIst = document.querySelector(".memo-list");
const emptyList = document.querySelector(".empty-list");
const manual = document.querySelector(".user-manual");
const manualState = document.getElementById("manual_state");

const listOrder = document.getElementById("list_order");
const listDeleteBtn = document.querySelector(".list-delete");
const regiBtn = document.getElementById("regi_button");
const resetBtn = document.getElementById("reset_button");

const maxLength = 200;
const initLength = `0/${maxLength}`;

const focusItems = [title, content, resetBtn, regiBtn, listDeleteBtn, listOrder];
let focusIdx = 0;

/* window onload */
window.onload = () => {
    title.focus();
};

/* getter, setter */
function setTitle(value) {
    title.value = value;
}

function getTitle() {
    return title.value;
}

function setContent(value) {
    content.value = value;
}

function getContent() {
    return content.value;
}

function setContentLength(value) {
    contentLength.textContent = value;
}

function getListOrder() {
    return listOrder.checked;
}

function toggleListOrder() {
    listOrder.checked = !getListOrder();
}

function getMaxLength() {
    return maxLength;
}

function getFocusIdx() {
    return focusIdx;
}

function setFocusIdx(idx) {
    focusIdx = idx;
}

function getManualState() {
    return manualState.checked;
}

function setManualState(value) {
    manualState.checked = value;
}

function toggleManual() {
    manualState.checked = !getManualState();
}

/* reset */
const reset = {
    // 제목 초기화
    title: () => {
        setTitle("");
    },

    // 내용 초기화
    content: () => {
        setContent("");
    },

    // 내용 길이 초기화
    contentLength: () => {
        setContentLength(initLength);
    },

    // 리스트 화면 초기화
    display: () => {
        dispMemoLIst.innerHTML = "";
    },

    // 리스트 전체 초기화
    listAll: () => {
        reset.display();
        allMemo.clearMemo();
        check.emptyList();
    },

    input: () => {
        reset.title();
        reset.content();
        reset.contentLength();
    },
};

/* check */
const check = {
    // 리스트 비어있는지 확인
    emptyList: () => {
        if (dispMemoLIst.childElementCount === 0) {
            emptyList.classList.remove("hidden");
        } else {
            emptyList.classList.add("hidden");
        }
    },

    // 제목 입력 확인
    title: () => {
        if (getTitle() === "") {
            alert("제목을 입력해주세요.");
            title.focus();
            return false;
        }
        return true;
    },

    // 내용 입력 확인
    content: () => {
        if (getContent() === "") {
            alert("내용을 입력해주세요.");
            content.focus();
            return false;
        }
        return true;
    },

    // 정렬 확인
    order: () => {
        return getListOrder();
    },

    // 설명서 확인
    manual: () => {
        return getManualState();
    },

    // 내용 길이 확인
    contentLength: (length) => {
        if (length > getMaxLength()) {
            alert("글자 수가 최대입니다.");
            return false;
        }
        return true;
    },

    // 전체삭제 확인
    resetAll: () => {
        if (confirm("메모를 모두 삭제하시겠습니까?")) {
            alert("메모가 모두 삭제되었습니다.");
            return true;
        }
        return false;
    },
};

let allMemo = new MemoList();
loadMemo();

/* key event */
const contentBoxEvent = (() => {
    /**
     * content key event
     *  'CTRL' + 'ENTER' : add memo
     * content event
     *  content length count event
     */

    content.addEventListener("keydown", (e) => {
        // content key event
        if (e.ctrlKey === true && e.key === "Enter") {
            regiBtn.click();
        }
    });

    content.addEventListener("keyup", () => {
        // content length event
        let length = getContent().length;
        if (!check.contentLength(length)) {
            setContent(getContent().slice(0, 200));
            length -= 1;
        }
        setContentLength(`${length}/${getMaxLength()}`);
    });
})();

const titleEnterEvent = (() => {
    // title key event 'ENTER'
    title.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setFocusIdx(getFocusIdx() + 1);
            focusItems[getFocusIdx()].focus();
        }
    });
})();

const windowKeyEvent = (() => {
    document.addEventListener("keydown", (e) => {
        /**
         * window key event
         *  'CTRL' + 'M' : manual on/off
         * 'ESC' : manual off
         *  'CTRL' + 'DELETE' : delete memo
         */

        if (e.ctrlKey === true && e.key === "m") {
            // manual on off event
            toggleManual();
            displayManual();
        } else if (check.manual && e.key === "Escape") {
            // manual off event
            setManualState(false);
            displayManual();
        } else if (e.ctrlKey === true && e.key === "Delete") {
            // delete memo evnet
            if (check.order()) {
                allMemo.shiftMemo().code;
            } else if (!check.order()) {
                allMemo.popMemo().code;
            }
            reset.display();
            check.emptyList;
            loadMemo();
        }
    });
})();

/* button event */
const regiBtnEvent = (() => {
    // regi button
    regiBtn.addEventListener("click", () => {
        if (check.title() && check.content()) {
            addItem("add");
            title.focus();
        }
    });
})();

const resetBtnEvent = (() => {
    // reset button
    resetBtn.addEventListener("click", () => {
        reset.input();
        title.focus();
    });
})();

const allResetEvent = (() => {
    // all reset button
    listDeleteBtn.addEventListener("click", () => {
        if (check.resetAll()) {
            reset.listAll();
            title.focus();
        }
    });
})();

const listOrderEvent = (() => {
    // list order checkbox
    listOrder.addEventListener("change", () => {
        reset.display();
        loadMemo();
        title.focus();
    });
})();

const manualEvent = (() => {
    // manual off event
    manualState.addEventListener("change", () => {
        displayManual();
        title.focus();
    });
})();

/* focus event */
const focusEvent = (() => {
    // window focus event 'TAB'
    focusItems.forEach((item) => {
        item.addEventListener("focus", (e) => {
            setFocusIdx(focusItems.indexOf(e.target));
        });
    });

    focusUp = function () {
        setFocusIdx(getFocusIdx() + 1);
        return getFocusIdx();
    };

    focusDown = function () {
        setFocusIdx(getFocusIdx() - 1);
        return getFocusIdx();
    };

    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey === true) {
                if (focusDown() === -1) {
                    setFocusIdx(focusItems.length - 1);
                }
                focusItems[getFocusIdx()].focus();
            } else if (e.shiftKey === false) {
                if (focusUp() === focusItems.length) {
                    setFocusIdx(0);
                }
                focusItems[getFocusIdx()].focus();
            }
        }
    });
})();

/* manual on off event */
function displayManual() {
    if (check.manual()) {
        manual.style.display = "block";
    } else if (!check.manual()) {
        manual.style.display = "none";
    }
}

/* load memo */
function loadMemo() {
    for (let i = 0; i < allMemo.getSize(); i++) {
        addItem("load", allMemo.getMemo(i), allMemo.getMemo(i).code);
    }
}

/* add memo */
function addItem(type, memo, code) {
    const item = document.createElement("li");
    const memoTitle = document.createElement("h3");
    const time = document.createElement("article");
    const memoDeleteBtn = document.createElement("button");
    const memoContent = document.createElement("pre");
    let memoCode;

    let date = [];

    if (type === "load") {
        memoCode = code;
        memoTitle.textContent = memo.title;
        memoContent.textContent = memo.content;
        date = memo.time.split(",");
    } else if (type === "add") {
        const titleValue = getTitle();
        const contentValue = getContent();

        memoCode = dispMemoLIst.childElementCount;
        memo = allMemo.addMemo(titleValue, contentValue, memoCode);
        date = memo.getDate();

        memoTitle.textContent = getTitle();
        memoContent.textContent = getContent();
    }
    memoDeleteBtn.classList.add("close-button");
    memoDeleteBtn.innerHTML = `
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="5" x2="20" y2="20" stroke="#333333" stroke-width="3" />
        <line x1="5" y1="20" x2="20" y2="5" stroke="#333333" stroke-width="3" />
    </svg>
    `;

    time.innerHTML = `
        <time datetime=${date[0]}-${date[1]}-${date[2]} class="time">${date[0]}-${date[1]}-${date[2]}</time>
        <time datetime=${date[3]} class="time">${date[3]}</time>
    `;

    reset.input();

    item.appendChild(memoTitle);
    item.appendChild(time);
    item.appendChild(memoDeleteBtn);
    item.appendChild(memoContent);
    if (check.order()) {
        dispMemoLIst.append(item);
    } else {
        dispMemoLIst.prepend(item);
    }
    check.emptyList();

    memoDeleteBtn.addEventListener("click", () => {
        allMemo.delMemo(memoCode);
        item.remove();
        check.emptyList();
    });
}

/**
 * ===== 키보드 입력 이벤트 // 사용자 매뉴얼 내용 =====
 * 1. 포커스 이동
 *  TAB -> INPUT 그룹 내에서 포커스 이동, SHIFT + TAB -> 반대 이동
 *  제목 -> ENTER -> 내용으로 포커스 이동
 * 2. 메모 저장
 *  내용 -> CTRL + ENTER -> 메모 바로 저장
 * 3. 메모 삭제
 *  CTRL + DEL 정렬 순서에 따라 제일 앞에 있는 메모 삭제
 *
 */
