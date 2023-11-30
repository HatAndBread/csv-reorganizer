import {useState} from "react";

function App() {
  const [rows, setRows] = useState<null | string[][]>(null);
  const [categories, setCategories] = useState<null | string[]>(null);
  const [category, setCategory] = useState<null | string>(null);
  const [order, setOrder] = useState<string>("asc");

  const handleFile = async (e: React.ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) return;

    const text = await file.text();

    const result = text.split(/\r?\n|\r|\n/g);
    setRows(result.slice(1).map(r => r.split(",")));
    setCategories(result[0].split(","));
    setCategory(null)
  };

  const sortCsv = () => {
    if (!categories || !category || !rows) return;

    const index = categories.indexOf(category);
    const multiplier = order === "asc" ? 1 : -1;
    //@ts-expect-error fuck off
    const sorted = rows.toSorted(
      //@ts-expect-error fuck off
      (a, b) => {
        if (isNumeric(a?.[index]) && isNumeric(b?.[index])) {
          const a2 = parseFloat(a[index]);
          const b2 = parseFloat(b[index]);
          return (a2 - b2) * multiplier
        } else {
          return (a?.[index]?.localeCompare(b?.[index]) || 0) * multiplier
        }
      }
    );

    const csvString = sorted.map((arr: string[]) => arr.join(",")).join("\n");
    const headers = categories.join(",") + "\n";
    const fileData = headers + csvString;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(fileData)
    );
    element.setAttribute("download", "sorted.csv");
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return (
    <>
      <main className="flex flex-col gap-4 p-8">
        <h1 className="text-4xl font-semi-bold">CSV Re-sorter</h1>
        <p className="mb-8">
          Have a CSV file that you want sorted by a certain column?
          Look no Further!
        </p>
        <p>Select a csv file that you would like to re-sort.</p>
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
          accept=".csv"
          onChange={handleFile}
        />
        {categories && (
          <>
            {category && (
              <h2>
                You have selected to sort by{" "}
                <span className="font-bold text-accent">{category}</span>
              </h2>
            )}
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1 bg-secondary">
                Which item would you like to sort by?
              </div>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {categories.map((header) => (
                  <li key={header}>
                    <button
                      onClick={() => {
                        setCategory(header);
                        //@ts-expect-error fuck off
                        document.activeElement.blur()
                      }}
                    >
                      {header}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {category && (
          <>
          <form>
              <h2>Sort Order</h2>
              <div className="flex flex-col w-fit">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Sort Ascending</span>
                    <input
                      type="radio"
                      onChange={(e) => {setOrder(e.target.value)}}
                      defaultChecked={true}
                      name="radio-10"
                      value="asc"
                      className="radio checked:bg-red-500"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Sort Descending</span>
                    <input
                      onChange={(e) => {setOrder(e.target.value)}}
                      value="desc"
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-blue-500"
                    />
                  </label>
                </div>
              </div>
            </form>
            <button className="btn btn-primary w-fit" onClick={sortCsv}>
              RESORT!
            </button>
          </>
        )}
      </main>
    </>
  );
}

//@ts-expect-error fuck off
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
    //@ts-expect-error fuck off
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


export default App
