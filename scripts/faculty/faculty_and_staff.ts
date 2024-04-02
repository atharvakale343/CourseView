import fs from "fs"

// Open and read in a text file called faculty-staff.txt
const filePath = "./faculty/faculty-staff.txt"
const outputFilePath = "./faculty/faculty-staff.json"
const fileContent = fs.readFileSync(filePath, "utf-8")

// Split by newline
const groups = fileContent.split("\n\n")

// Within each group, take the first line as the staff name
const names = groups
  .map(group => group.split("\n")[0])
  .filter(name => name !== "")
  .filter(name => !/\d/.test(name))
  .filter(name => name !== "\f")

// get frequency counts of names, useful for data cleaning
// const nameCounts: { [key: string]: number } = names.reduce(
//   (counts: { [key: string]: number }, name: string) => {
//     counts[name] = (counts[name] || 0) + 1
//     return counts
//   },
//   {},
// )

// console.log(Object.entries(nameCounts).sort((a, b) => a[0].length - b[0].length))
// console.log(Object.entries(nameCounts).sort((a, b) => b[1] - a[1]))

// Check if every name has a single comma
// const namesWithoutASingleComma = names.filter(name => name.split(",").length !== 2)
// console.log(namesWithoutASingleComma)

// Split by command and invert Last, First to First Last
const namesInverted = names.map(name => {
  const [last, first] = name.split(",")
  return `${first.trim()} ${last.trim()}`
}).sort((a, b) => a.localeCompare(b));


// Write the names to a file as a json array
fs.writeFileSync(outputFilePath, JSON.stringify(namesInverted, null, 2))
