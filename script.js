// -----------------------------
// Application Startup
// -----------------------------
showCalculator("Horizontal Balustrade");


// -----------------------------
// Create Calculator
// -----------------------------
function showCalculator(title) {

    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="card">

            <h2>${title}</h2>

            <div class="row">
                <label>Rail Length (mm)</label>
                <input id="railLength" type="number">
            </div>

            <div class="row">
                <label>Spindle Width (mm)</label>
                <input id="spindleWidth" type="number" value="40">
            </div>

            <div class="row">

                <label>Calculation Method</label>

                <div>

                    <label>
                        <input
                            type="radio"
                            name="method"
                            value="gap"
                            checked>
                        Maximum Gap
                    </label>

                    <label style="margin-left:20px">

                        <input
                            type="radio"
                            name="method"
                            value="count">

                        Number of Spindles

                    </label>

                </div>

            </div>

            <div class="row">
                <label>Maximum Gap (mm)</label>
                <input id="maximumGap" type="number" value="99">
            </div>

            <div class="row">
                <label>Number of Spindles</label>
                <input id="spindleCount" type="number" disabled>
            </div>

            <div id="results"></div>

        </div>
    `;

    document
        .querySelectorAll("input")
        .forEach(i => i.addEventListener("input", calculate));

    document
        .querySelectorAll("input[name='method']")
        .forEach(r => r.addEventListener("change", calculationMethodChanged));


    calculationMethodChanged();
	document.querySelectorAll('.tab').forEach(button => {

    button.onclick = () => {

        document
            .querySelectorAll('.tab')
            .forEach(tab => tab.classList.remove('active'));

        button.classList.add('active');

        show(button.dataset.tab == "h"
            ? "Horizontal Balustrade"
            : "Staircase (Sloping Rail)");

    };

});
}


// -----------------------------
// Radio Button Changed
// -----------------------------
function calculationMethodChanged() {

    const method =
        document.querySelector("input[name='method']:checked").value;

    const maximumGap =
        document.getElementById("maximumGap");

    const spindleCount =
        document.getElementById("spindleCount");

    if (method === "gap") {

        maximumGap.disabled = false;
        spindleCount.disabled = true;
        spindleCount.value = "";

    }
    else {

        maximumGap.disabled = true;
        spindleCount.disabled = false;
        maximumGap.value = "";

    }

    calculate();
}


// -----------------------------
// Perform Calculation
// -----------------------------
function calculate() {

    const railLength =
        Number(document.getElementById("railLength").value);

    const spindleWidth =
        Number(document.getElementById("spindleWidth").value);

    const maximumGap =
        Number(document.getElementById("maximumGap").value);

    const spindleCount =
        Number(document.getElementById("spindleCount").value);

    const results =
        document.getElementById("results");

    const method =
        document.querySelector("input[name='method']:checked").value;

    if (railLength <= 0 || spindleWidth <= 0) {

        results.innerHTML =
            "<p>Please enter Rail Length and Spindle Width.</p>";

        return;
    }

    let actualSpindles;
    let actualGap;

    if (method === "gap") {

        if (maximumGap <= 0) {

            results.innerHTML =
                "<p>Please enter Maximum Gap.</p>";

            return;
        }

        actualSpindles =
            Math.ceil(
                (railLength - maximumGap) /
                (spindleWidth + maximumGap));

        actualGap =
            (railLength - (actualSpindles * spindleWidth))
            / (actualSpindles + 1);

    }
    else {

        if (spindleCount <= 0) {

            results.innerHTML =
                "<p>Please enter Number of Spindles.</p>";

            return;
        }

        actualSpindles = spindleCount;

        actualGap =
            (railLength - (actualSpindles * spindleWidth))
            / (actualSpindles + 1);
    }

    const totalSpindleWidth =
        actualSpindles * spindleWidth;

    const totalGapWidth =
        railLength - totalSpindleWidth;

    const numberOfGaps =
        actualSpindles + 1;

    const recommendedSpindles =
        Math.ceil(
            (railLength - 99) /
            (spindleWidth + 99));

    const recommendedGap =
        (
            (railLength - (recommendedSpindles * spindleWidth))
            /
            (recommendedSpindles + 1)
        ).toFixed(2);

    let html = `
        <h3>Results</h3>

        <table>

            <tr>
                <td><strong>Spindles</strong></td>
                <td>${actualSpindles}</td>
            </tr>

            <tr>
                <td><strong>Actual Gap</strong></td>
                <td>${actualGap.toFixed(2)} mm</td>
            </tr>

            <tr>
                <td><strong>Total Width of Spindles</strong></td>
                <td>${totalSpindleWidth} mm</td>
            </tr>

            <tr>
                <td><strong>Total Width of Gaps</strong></td>
                <td>${totalGapWidth} mm</td>
            </tr>

            <tr>
                <td><strong>Number of Gaps</strong></td>
                <td>${numberOfGaps}</td>
            </tr>

        </table>

        <hr>
    `;

    if (method === "gap") {

        html += `
            <p class="good">

                ✓ Required Spindles:
                <strong>${actualSpindles}</strong>

                <br>

                Actual Gap:
                <strong>${actualGap.toFixed(2)} mm</strong>

            </p>`;
    }
    else {

        if (actualGap <= 99) {

            html += `
                <p class="good">

                    ✓ Complies with UK Building Regulations
                    (Maximum 99 mm gap)

                </p>`;
        }
        else {

            html += `
                <p class="bad">

                    ⚠ Gap exceeds the recommended
                    maximum of 99 mm.

                    <br><br>

                    Increase to
                    <strong>${recommendedSpindles}</strong>
                    spindles.

                    <br>

                    New Gap:
                    <strong>${recommendedGap} mm</strong>

                </p>`;
        }
    }

    results.innerHTML = html;
}