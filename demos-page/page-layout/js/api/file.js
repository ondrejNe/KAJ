export const loadJSONFile = () => {
    return new Promise((resolve, reject) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type === "application/json") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const json = JSON.parse(e.target.result);
                        resolve(json);
                    } catch (error) {
                        reject(new Error("Error parsing JSON: " + error.message));
                    }
                };
                reader.readAsText(file);
            } else {
                reject(new Error("Please select a valid JSON file."));
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
};

export const saveJSONFile = (data) => {
    const filename = prompt("Name of the file to save:", "data.json");
    if (filename) {
        const jsonString = JSON.stringify(data, null, 4);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
