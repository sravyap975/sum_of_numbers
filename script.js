document.addEventListener("DOMContentLoaded", () => {

    let l1 = [];
    let l2 = [];
    let carry = 0;
    let index = 0;
    let building = false;

    let decimalPlaces = 0;
    let finalDigits = [];

    /* ================= Build List Animation ================= */
    function buildListAnimated(number, containerId, className, callback) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        const digits = number.split("").reverse().map(Number);
        let i = 0;

        function insertNode() {
            if (i >= digits.length) {
                callback(digits);
                return;
            }

            const node = document.createElement("div");
            node.className = `node ${className} active`;
            node.innerText = digits[i];
            node.id = `${containerId}-node-${i}`;
            container.appendChild(node);

            setTimeout(() => {
                node.classList.remove("active");
                i++;
                insertNode();
            }, 500);
        }

        insertNode();
    }

    function buildLists() {
        if (building) return;

        let num1 = document.getElementById("num1").value.trim();
        let num2 = document.getElementById("num2").value.trim();

        if (!isValid(num1) || !isValid(num2)) {
            alert("Enter valid numbers (digits with optional decimal)");
            return;
        }

        const normalized = normalizeDecimals(num1, num2);
        num1 = normalized.a;
        num2 = normalized.b;
        decimalPlaces = normalized.decimals;

        building = true;
        document.getElementById("nextBtn").disabled = true;
        document.getElementById("explanation").innerText = "Forming List 1...";
        document.getElementById("result").innerHTML = "";
        document.getElementById("decimalResult").innerText = "0";

        finalDigits = [];
        carry = 0;
        index = 0;
        document.getElementById("carry").innerText = carry;

        buildListAnimated(num1, "list1", "list1-node", d1 => {
            l1 = d1;
            document.getElementById("explanation").innerText = "Forming List 2...";
            buildListAnimated(num2, "list2", "list2-node", d2 => {
                l2 = d2;
                document.getElementById("explanation").innerHTML =
                    "✅ Linked lists created after decimal normalization.<br>Click <b>Next Step</b>.";
                document.getElementById("nextBtn").disabled = false;
                building = false;
            });
        });
    }

    function nextStep() {
        if (building) return;

        if (index >= l1.length && index >= l2.length && carry === 0) {
            showFinalDecimal();
            document.getElementById("explanation").innerText =
                "✅ Addition completed. Decimal point restored.";
            return;
        }

        clearHighlights();

        const x = index < l1.length ? l1[index] : 0;
        const y = index < l2.length ? l2[index] : 0;

        highlight("list1", index);
        highlight("list2", index);

        const prevCarry = carry;
        const sum = x + y + prevCarry;
        const digit = sum % 10;
        carry = Math.floor(sum / 10);

        finalDigits.unshift(digit);

        const node = document.createElement("div");
        node.className = "node result-node active";
        node.innerText = digit;
        document.getElementById("result").appendChild(node);

        document.getElementById("carry").innerText = carry;

        document.getElementById("explanation").innerHTML = `
            <b>Step ${index + 1}</b><br>
            Digits: ${x} + ${y}<br>
            Previous Carry: ${prevCarry}<br>
            Sum: ${sum}<br>
            Result Digit: ${digit}, New Carry: ${carry}
        `;

        index++;
    }

    function normalizeDecimals(a, b) {
        const da = a.includes(".") ? a.split(".")[1].length : 0;
        const db = b.includes(".") ? b.split(".")[1].length : 0;
        const max = Math.max(da, db);

        if (!a.includes(".")) a += "." + "0".repeat(max);
        if (!b.includes(".")) b += "." + "0".repeat(max);

        a = padDecimal(a, max);
        b = padDecimal(b, max);

        return {
            a: a.replace(".", ""),
            b: b.replace(".", ""),
            decimals: max
        };
    }

    function padDecimal(num, max) {
        const p = num.split(".");
        return p[0] + "." + p[1].padEnd(max, "0");
    }

    function showFinalDecimal() {
        let res = finalDigits.join("");
        if (decimalPlaces > 0) {
            const pos = res.length - decimalPlaces;
            res = res.slice(0, pos) + "." + res.slice(pos);
        }
        document.getElementById("decimalResult").innerText = res;
    }

    function highlight(id, i) {
        const n = document.getElementById(`${id}-node-${i}`);
        if (n) n.classList.add("active");
    }

    function clearHighlights() {
        document.querySelectorAll(".node").forEach(n =>
            n.classList.remove("active")
        );
    }

    function isValid(n) {
        return /^\d+(\.\d+)?$/.test(n);
    }

    document.getElementById("buildBtn").addEventListener("click", buildLists);
    document.getElementById("nextBtn").addEventListener("click", nextStep);
});
