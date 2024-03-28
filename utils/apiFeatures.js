class APIFeatures {
    // query: mongoose query
    // queryString: from req.query
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {

        // simple filtering
        let queryObj = { ...this.queryString }
        let excluded = ['sort', 'limit', 'page', 'fields']
        excluded.forEach(el => delete queryObj[el])

        // advanced filtering
        let str = JSON.stringify(queryObj)
        str = str.replace(/\b(gte|gt|lte|lt)\b/g, match => '$' + match)

        this.query = this.query.find(JSON.parse(str))

        return this;
    }

    sort() {
        // query string: ?sort=price,ratingsAverage   or ?sort=-price
        if (this.queryString.sort) {
            let str = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(str) // query.sort('price ratingsAverage')
            // nb: query.sort('-price') --> sort descending for price
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    fields() {
        // query string: ?fields=name,duration   or ?fields=-name,-duration for exclusion
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        return this;
    }
    
    pagination(){
        // query string: ?page=1&limit=10
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;

    }


}

module.exports = APIFeatures;