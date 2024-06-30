document.addEventListener("DOMContentLoaded", function() {
    const memoInput = document.getElementById("memo-input");
    const addMemoButton = document.getElementById("add-memo-button");
    const memoList = document.getElementById("memo-list");
    const completedList = document.getElementById("completed-list");
    const searchInput = document.getElementById("search-input");
    const memoListTitle = document.querySelector("h2:nth-of-type(1)");
    const completedListTitle = document.querySelector("h2:nth-of-type(2)");

    // Load saved memos from localStorage
    loadMemos();

    addMemoButton.addEventListener("click", function() {
        const memoText = memoInput.value.trim();
        if (memoText !== "") {
            addMemo(memoText, false);
            memoInput.value = "";
            saveMemos();
            updateTitles();
        }
    });

    document.body.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("complete")) {
            completeMemo(target);
        } else if (target.classList.contains("delete")) {
            deleteMemo(target);
        } else if (target.classList.contains("edit")) {
            editMemo(target);
        } else if (target.tagName === "LI" || target.tagName === "SPAN") {
            toggleButtons(target.closest("li"));
        }
    });

    searchInput.addEventListener("input", function() {
        filterMemos(searchInput.value.trim().toLowerCase());
    });

    function createButton(text, className) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add(className);
        return button;
    }

    function addMemo(text, isCompleted) {
        const listItem = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = text;
        listItem.appendChild(span);
        listItem.classList.add("adding");

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");
        if (!isCompleted) {
            buttonsDiv.appendChild(createButton("Complete", "complete"));
        }
        buttonsDiv.appendChild(createButton("Edit", "edit"));
        buttonsDiv.appendChild(createButton("Delete", "delete"));
        listItem.appendChild(buttonsDiv);

        if (isCompleted) {
            completedList.appendChild(listItem);
        } else {
            memoList.appendChild(listItem);
        }
        updateTitles();
    }

    function completeMemo(target) {
        const listItem = target.parentElement.parentElement;
        listItem.classList.add("removing");
        setTimeout(() => {
            memoList.removeChild(listItem);
            target.parentElement.removeChild(target);
            completedList.appendChild(listItem);
            listItem.classList.remove("removing");
            saveMemos();
            updateTitles();
        }, 300);
    }

    function deleteMemo(target) {
        if (confirm("Are you sure to delete this?")) {
            const listItem = target.parentElement.parentElement;
            listItem.classList.add("removing");
            setTimeout(() => {
                listItem.parentElement.removeChild(listItem);
                saveMemos();
                updateTitles();
            }, 300);
        }
    }

    function editMemo(target) {
        const listItem = target.parentElement.parentElement;
        const memoText = listItem.firstChild.textContent;
        memoInput.value = memoText;
        listItem.parentElement.removeChild(listItem);
        saveMemos();
        updateTitles();
    }

    function toggleButtons(listItem) {
        const activeItem = document.querySelector("li.active");
        if (activeItem && activeItem !== listItem) {
            activeItem.classList.remove("active");
        }
        listItem.classList.toggle("active");
    }

    function saveMemos() {
        const memos = [];
        memoList.querySelectorAll("li").forEach(item => {
            memos.push({ text: item.firstChild.textContent, completed: false });
        });
        completedList.querySelectorAll("li").forEach(item => {
            memos.push({ text: item.firstChild.textContent, completed: true });
        });
        localStorage.setItem("memos", JSON.stringify(memos));
    }

    function loadMemos() {
        const memos = JSON.parse(localStorage.getItem("memos")) || [];
        memos.forEach(memo => addMemo(memo.text, memo.completed));
        updateTitles();
    }

    function filterMemos(query) {
        const items = document.querySelectorAll("li");
        items.forEach(item => {
            const text = item.firstChild.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    function updateTitles() {
        memoListTitle.style.display = memoList.children.length ? 'block' : 'none';
        completedListTitle.style.display = completedList.children.length ? 'block' : 'none';
    }
});
