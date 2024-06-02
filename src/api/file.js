
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
