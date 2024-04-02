import { Observable } from "rxjs"
import { Pagination } from "./Pagination"

export class Pager<T>{
    public readonly optionsLimitRecords = [ 5, 10, 15, 20, 30 ]
    private readonly defaultlimit = 5
    private readonly currentDefaultPage  = 1
    private _totalRecords?: number
    private _page: number
    private _totalPages?: number
    private _limit: number
    private _filters?: T
    private _functionGetResources: (page: number, limit: number, filters?: T) => Observable<Pagination>

    constructor(functionGetResources: (page: number, limit: number, filters?: T)=> Observable<Pagination>) {
        this._limit = this.defaultlimit
        this._page = this.currentDefaultPage 
        this._functionGetResources = functionGetResources
    }

    begin(
        page:number = this.currentDefaultPage , 
        limit: number = this.defaultlimit, 
        filters?: T
    ){
        this._page = page
        this._limit = limit
        this._filters = filters
        this._functionGetResources(page, limit, filters).subscribe({
            next: (pagination) => {
                this.changeTotals(pagination)
            }
        })
    }

    changeLimitPerPage(newLimit: number){
        this._limit = newLimit;
        if(!this._page){
            throw Error('A current page has not been established');
        }
        this._functionGetResources(this.page, newLimit, this._filters).subscribe({
            next: (pagination) => {
                this.changeTotals(pagination)
            }
        })
    }

    cambiarPagina(page: number){
        this._page = page
        this._functionGetResources(page, this._limit, this._filters).subscribe({
            next: (pagination) => {
                this.changeTotals(pagination)
            }
        })
    }

    filter(filters?: T){
        this._filters = filters
        this._functionGetResources(this.currentDefaultPage , this.defaultlimit, this._filters).subscribe({
            next: (pagination) => {
                this.changeTotals(pagination)
            }
        })
    }

    refrescar(){
        this._functionGetResources(this._page, this._limit, this._filters).subscribe({
            next: ()=>{}
        })
    }

    private changeTotals(pagination: Pagination){
        
        this._totalRecords = pagination?.totalRecords
        this._totalPages = pagination?.totalPages
    }

    public get totalRecords(){
        return this._totalRecords
    }
    public get totalPages(){
        return this._totalPages
    }
    public get page(){
        return this._page
    }
    public get limit(){
        return this._limit
    }
}