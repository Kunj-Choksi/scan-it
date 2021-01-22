import { Interface } from "readline";

export interface Image {
    id: number,
    imageBase64: string,
    date: Date,
    height: number,
    width: number
}