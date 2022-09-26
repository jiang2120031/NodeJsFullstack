const Table = require('cli-table')

cli()

function cli() {
    const [tag] = process.argv.slice(2)

    console.log(process.argv[0])
    console.log(process.argv[1])
    console.log(tag);

    const headers = ['ID', 'Description', 'Tags', 'User']

    const margin = headers.length
    const width = process.stdout.columns - margin
    const widthId = 30
    const widthOther = Math.floor((width - widthId) / (headers.length - 1))
    const table = new Table({
        head: headers,
        colWidths: [widthId, widthOther, widthOther, widthOther]
    })

    const products = [
        { _id: "1", description: "desc1", userName: "jetlee", tags: ["a", "tag2", "tab3"] },
        { _id: "2", description: "desc1", userName: "jetlee", tags: ["a", "tag2", "tab3"] },
        { _id: "3", description: "desc1", userName: "jetlee", tags: ["a", "tag2", "tab3"] },
        { _id: "4", description: "desc1", userName: "jetlee", tags: ["a", "tag2", "tab3"] }
    ];

    products.forEach(p => table.push([
        p._id,
        p.description.replace(/\n|\r/g, ' '),
        p.userName,
        p.tags.slice(0, 3).join(', ')
    ]))
    console.log(table.toString())

}
