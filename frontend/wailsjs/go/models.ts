export namespace main {
	
	export class OrderResponse {
	    status: string;
	    totalTimeMs: number;
	    cocktailName: string;
	
	    static createFrom(source: any = {}) {
	        return new OrderResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.totalTimeMs = source["totalTimeMs"];
	        this.cocktailName = source["cocktailName"];
	    }
	}

}

