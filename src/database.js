import fs from 'node:fs/promises'

const dataBasePath = new URL('../db.json', import.meta.url)

export class DataBase {
    #database = {}

    constructor(){
        fs.readFile(dataBasePath).then((data) => {
            this.#database = JSON.parse(data.toString())
        }).catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(dataBasePath, JSON.stringify(this.#database, null, 2))
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
    }

    select(table, search){
        let data = this.#database[table] ?? []

        if(search){
            data = data.filter((row) => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    update(table, id, data){
        const index = this.#database[table].findIndex((row) => row.id === id)
        data = this.#database[table][index] ?? null

        if(index > -1){
            this.#database[table][index] = {
                ...this.#database[table][index],
                ...data,
                updated_at: new Date()
            }

            this.#persist()
        }

        return data

    }

    delete(table, id){
        const index = this.#database[table].findIndex((row) => row.id === id)
        const data = this.#database[table][index] ?? null
        
        if(index > -1){
            this.#database[table].splice(index, 1)

            this.#persist()
        }

        return data

    }
}