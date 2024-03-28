const Tour = require(`${__dirname}/../models/tourModel`)
let catchAsync = require(`${__dirname}/../utils/catchAsync`)

// NB this controller is just for example purposes but it doesn't have a model or route in this project

exports.aliasTop5 = async (req, res, next) => {
    req.query.sort = '-ratingsAverage,price'
    req.query.limit = '5'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                //_id:null, // all tours in one group
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 }, // add one for each encountered document
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 } // 1 for ascending sorting and -1 for descending
        },
        {
            // you can repeat stages
            $match: { _id: { $ne: 'EASY' } } // the _id now is the new _id we've set above (difficulty)
        }

    ])
    res.status(200).json({ status: "success", data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates' // unwinds the document into several version for each element in the past field (assuming the field is an array)

        },
        {
            $match: {
                startDates: { // limit results to passed year only
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' },
            }
        },
        {
            $addFields: {
                month: '$_id' // to add new fields
            }
        },
        {
            $project: { // 0 to hide a field, 1 to show a field
                _id: 0
            }
        },
        {
            $sort: {
                month: 1
            }
        },
        {
            $limit: 6 // limits number of output documents
        }
    ])

    res.status(200).json({ status: "success", data: { plan } });


});