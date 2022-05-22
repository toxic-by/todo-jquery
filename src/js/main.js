jQuery(function () {
    let allData = [];
    let renderData = [];

    $("#btnAddTodo").on("click", function () {
        const input = $("#inputTodo").val();
        if (input) {
            allData.push({ val: input, important: false, done: false });
        }
        $("#inputTodo").val("");
        render();
        updateCount();
    });

    $("#searchTodo").on("keyup", function () {
        updateCount();
        render();
    });

    function render() {
        $(".output").empty();
        const searchValue = $("#searchTodo").val();

        if (searchValue) {
            renderData = allData.filter((item) => item.val.includes(searchValue));
        } else {
            renderData = allData;
        }

        if (renderData.length > 0) {
            $(".hint").addClass("active");
        } else {
            $(".hint").removeClass("active");
        }

        renderData.forEach((listItem, idx) => {
            $(".output").append(createListItem(listItem, idx));
        });
    }

    function createListItem(item, idx) {
        const removeBtn = $(document.createElement("button")).attr("type", "button").addClass("btn btn-close");
        const importantBtn = $(document.createElement("button"))
            .attr("type", "button")
            .addClass("btn btn-outline-success")
            .text("!");
        const textSpan = $(document.createElement("span")).text(item.val);
        if (item.important) importantBtn.addClass("btn-success");
        if (item.done) $(textSpan).wrapInner("<del></del>");

        removeBtn.on("click", function () {
            allData.splice(idx, 1);
            render();
            updateCount();
        });

        textSpan.on("click", function () {
            allData.map((item, i) => {
                if (i === idx) {
                    item.done = !item.done;
                }
                return item;
            });
            render();
            updateCount();
        });

        importantBtn.on("click", function () {
            allData.map((item, i) => {
                if (i === idx) {
                    item.important = !item.important;
                }
                return item;
            });
            render();
            updateCount();
        });

        const buttonsWrapper = $(document.createElement("div")).append([importantBtn, removeBtn]);

        const listItem = $(document.createElement("li"))
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .append(textSpan)
            .append(buttonsWrapper);

        return listItem;
    }

    function updateCount() {
        const important = allData.filter((item) => item.important).length;
        const done = allData.filter((item) => item.done).length;
        const totalCount = allData.length;
        const activeCount = totalCount - done;

        $("#importantCount").text(important);
        $("#doneCount").text(done);
        $("#activeCount").text(activeCount);
    }
});
