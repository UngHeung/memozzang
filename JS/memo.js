const title = document.getElementById("input_title");
const content = document.getElementById("input_content");
const memoList = document.querySelector(".memo-list");
const emptyList = document.querySelector(".empty-list");

const regiBtn = document.getElementById("regi_button");
const resetBtn = document.getElementById("reset_button");

function getTitle() {
    return title.value;
}

function getContent() {
    return content.value;
}

function regiBtnEvent() {
    regiBtn.addEventListener("click", () => {
        if (check.title() && check.content()) {
            const item = document.createElement("li");
            const memoTitle = document.createElement("h3");
            const memoDeleteBtn = document.createElement("button");
            const memoContent = document.createElement("pre");

            memoTitle.textContent = getTitle();
            memoContent.textContent = getContent();
            memoDeleteBtn.classList.add("close-button");

            reset.title();
            reset.content();

            item.appendChild(memoTitle);
            item.appendChild(memoDeleteBtn);
            item.appendChild(memoContent);
            memoList.appendChild(item);
            check.emptyList();

            memoDeleteBtn.addEventListener("click", () => {
                item.remove();
                check.emptyList();
            });
        }
    });
}
regiBtnEvent();

function resetBtnEvent() {
    resetBtn.addEventListener("click", () => {
        reset.title();
        reset.content();
    });
}
resetBtnEvent();

function checkList() {
    if (memoList.childElementCount === 0) {
        emptyList.classList.remove("hidden");
    } else {
        emptyList.classList.add("hidden");
    }
}

const check = {
    emptyList: function () {
        if (memoList.childElementCount === 0) {
            emptyList.classList.remove("hidden");
        } else {
            emptyList.classList.add("hidden");
        }
    },

    title: function () {
        if (title.value === "") {
            alert("제목을 입력해주세요.");
            return false;
        }
        return true;
    },

    content: function () {
        if (content.value === "") {
            alert("내용을 입력해주세요.");
            return false;
        }
        return true;
    },
};

const reset = {
    title: () => {
        title.value = "";
    },

    content: () => {
        content.value = "";
    },
};
