const title = document.getElementById("input_title");
const content = document.getElementById("input_content");
const contentLength = document.querySelector(".content-length");
const memoList = document.querySelector(".memo-list");
const emptyList = document.querySelector(".empty-list");

const listOrder = document.getElementById("list_order");
const listDeleteBtn = document.querySelector(".list-delete");
const regiBtn = document.getElementById("regi_button");
const resetBtn = document.getElementById("reset_button");

const maxLength = 200;
const initContent = `0/${maxLength}`;

window.onload = () => {
    title.focus();
};

function getTitle() {
    return title.value;
}

function setContent(value) {
    content.value = value;
}

function getContent() {
    return content.value;
}

/* reset */
const reset = {
    // 제목 초기화
    title: () => {
        title.value = "";
    },

    // 내용 초기화
    content: () => {
        content.value = "";
    },

    // 내용 길이 초기화
    contentLength: () => {
        contentLength.textContent = initContent;
    },

    // 리스트 화면 초기화
    display: () => {
        memoList.innerHTML = "";
    },

    // 리스트 전체 초기화
    listAll: () => {
        memoList.innerHTML = "";
        allMemo.splice(0, allMemo.length);
        localStorage.clear();
        check.emptyList();
    },
};

function resetInput() {
    reset.title();
    reset.content();
    reset.contentLength();
}

/* check */
const check = {
    // 리스트 비어있는지 확인
    emptyList: () => {
        if (memoList.childElementCount === 0) {
            emptyList.classList.remove("hidden");
        } else {
            emptyList.classList.add("hidden");
        }
    },

    // 제목 입력 확인
    title: () => {
        if (title.value === "") {
            alert("제목을 입력해주세요.");
            return false;
        }
        return true;
    },

    // 내용 입력 확인
    content: () => {
        if (content.value === "") {
            alert("내용을 입력해주세요.");
            return false;
        }
        return true;
    },

    // 정렬 확인
    order: () => {
        return listOrder.checked;
    },

    // 내용 길이 확인
    contentLength: (length) => {
        if (length > maxLength) {
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

let allMemo = JSON.parse(localStorage.getItem("allMemo"));
allMemo = allMemo ?? [];
loadMemo("none");

const contentBoxKeyEvent = (() => {
    content.addEventListener("keydown", (e) => {
        if (e.ctrlKey === true && e.key === "Enter") {
            regiBtn.click();
        }
    });
})();

/* button event */
const regiBtnEvent = (() => {
    regiBtn.addEventListener("click", () => {
        if (check.title() && check.content()) {
            addItem("add");
        }
        title.focus();
    });
})();

const resetBtnEvent = (() => {
    resetBtn.addEventListener("click", () => {
        resetInput();
        title.focus();
    });
})();

const contentLengthEvent = (() => {
    content.addEventListener("keyup", () => {
        let length = content.value.length;
        if (!check.contentLength(length)) {
            setContent(getContent().slice(0, 200));
            length -= 1;
        }
        contentLength.innerText = `${length}/${maxLength}`;
    });
})();

const resetAllEvent = (() => {
    listDeleteBtn.addEventListener("click", () => {
        if (check.resetAll()) {
            reset.listAll();
            title.focus();
        }
    });
})();

const listOrderEvent = (() => {
    listOrder.addEventListener("change", () => {
        reset.display();
        loadMemo();
    });
})();

// focus event 'TAB'
const focusEvent = (() => {
    const items = [title, content, listDeleteBtn, listOrder, resetBtn, regiBtn];
    let focusIdx = 0;

    items.forEach((item) => {
        item.addEventListener("focus", (e) => {
            focusIdx = items.indexOf(e.target);
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey === true) {
                if (focusIdx-- === 0) {
                    focusIdx = items.length - 1;
                }
                items[focusIdx].focus();
            } else if (e.shiftKey === false) {
                if (focusIdx++ === items.length - 1) {
                    focusIdx = 0;
                }
                items[focusIdx].focus();
            }
        }
    });
})();

// key evnet 'DEL'
const deleteEvent = (() => {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey === true && e.key === "Delete") {
            if (check.order()) {
                allMemo.shift();
            } else if (!check.order()) {
                allMemo.pop();
            }
            localStorage.setItem("allMemo", JSON.stringify(allMemo));
            reset.display();
            check.emptyList;
            loadMemo();
        }
    });
})();

/* load memo */
function loadMemo() {
    for (let i = 0; i < allMemo.length; i++) {
        addItem("load", allMemo[i], allMemo[i].code);
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
        memoTitle.textContent = memo.titleValue;
        memoContent.textContent = memo.titleContent;
        date = memo.time.split(",");
    } else if (type === "add") {
        const titleValue = title.value;
        const titleContent = content.value;

        const today = new Date();
        date.push(today.getFullYear());
        date.push(today.getMonth() + 1);
        date.push(today.getDate());
        date.push(`${today.getHours()}:${today.getMinutes()}`);
        const time = date.toString();

        memoCode = memoList.childElementCount;
        allMemo.push({ titleValue, titleContent, time, code: memoCode });
        localStorage.setItem("allMemo", JSON.stringify(allMemo));

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

    resetInput();

    item.appendChild(memoTitle);
    item.appendChild(time);
    item.appendChild(memoDeleteBtn);
    item.appendChild(memoContent);
    if (check.order()) {
        memoList.append(item);
    } else {
        memoList.prepend(item);
    }
    check.emptyList();

    memoDeleteBtn.addEventListener("click", () => {
        allMemo.splice(
            allMemo.findIndex((item) => item.code === memoCode),
            1
        );
        localStorage.setItem("allMemo", JSON.stringify(allMemo));
        item.remove();
        check.emptyList();
    });
}
