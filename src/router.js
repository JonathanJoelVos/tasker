import { DataBase } from "./database.js"
import {randomUUID} from 'node:crypto'
import { buildRouterPath } from "./utils/build-router-path.js"

const database = new DataBase()

export const routes = [
    {
        method: 'GET',
        path: buildRouterPath('/tasks'),
        handler: (req, res) => {
            const {search} = req.query
            console.log(search)

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRouterPath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body

            if(!title || !description) return res.writeHead(400).end('Bad Request')


            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }
            database.insert('tasks', task)

            return res.end('Hello World')
        }

    },
    {
        method: 'PUT',
        path: buildRouterPath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body

            if(!title || !description) return res.writeHead(400).end('Bad Request')

            const isDataFind = database.update('tasks', id, {
                title,
                description,
            })

            if(!isDataFind) return res.writeHead(404).end('Not Found')

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRouterPath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            const isDataFind = database.delete('tasks', id)

            if(!isDataFind) return res.writeHead(404).end('Not Found')

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRouterPath('/tasks/:id/completed'),
        handler: (req, res) => {
            const {id} = req.params
            console.log(id)

            database.update('tasks', id, {
                completed_at: new Date(),
            })

            res.writeHead(204).end()
        }
    }
]