import axios from "axios";
import Transaction from "../models/transactionSchema.js";




export const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json'); 
        const seedData = response.data;

        for (let transactionData of seedData) {
            const transaction = new Transaction({
                title: transactionData.title,
                price: transactionData.price,
                description: transactionData.description,
                category: transactionData.category,
                image: transactionData.image,
                sold: transactionData.sold,
                dateOfSale: new Date(transactionData.dateOfSale)
            });

            await transaction.save();
        }

        res.status(200).json(seedData);

    } catch (error) {
        res.status(500).json({ message: "Error initializing database", error: error });
    }
}



export const transactionAll = async (req, res) => {

    const searchText = req.query.searchText || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;
    const month = parseInt(req.query.month) || 3;
    try {
        
        const transactions = await Transaction.find({
            '$or': [
                { title: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } },   
            ],
            $expr: { $eq: [{ $month: '$dateOfSale' }, month] }

        })
            .skip(skip)
            .limit(perPage)


        res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const getStatistics = async (req, res) => {

    const  month  = req.query.month ;

    try {

        const selectedMonth = parseInt(month);

        const totalSaleAmount = await Transaction.aggregate([

            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, selectedMonth]
                    },
                    sold: true,
                }
            },
            {
                '$group': {
                    "_id": {
                        month: { $month: '$dateOfSale' }
                    },
                    total: {
                        $sum: '$price'
                    }
                },

            }
        ]);


        // Count the number of sold items for the selected month
        const totalSoldItems = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: '$dateOfSale' }, selectedMonth] },
            sold: true
        });

        // Count the number of not sold items for the selected month
        const totalNotSoldItems = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: '$dateOfSale' }, selectedMonth] },
            sold: false
        });

        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems

        })

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}




export const barChart = async (req, res) => {
    const month = parseInt(req.query.month);

    // Validate month parameter (optional)
    if (!month || month < 1 || month > 12) {
      return res.status(400).send('Invalid month value (1-12)');
    }
    try{

        const pipeline = [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: [{ $month: '$dateOfSale' }, month] },
                    { $lte: [{ $month: '$dateOfSale' }, month] }
                  ]
                }
              }
            },
            {
              $project: {
                priceRange: {
                  $floor: { $divide: ["$price", 100] } // Calculate price range (0, 1, 2, ...)
                }
              }
            },
            {
              $group: {
                _id: "$priceRange",
                count: { $sum: 1 } // Count documents in each range
              }
            }
          ];
      
          const results = await Transaction.aggregate(pipeline);
      
          const labels = results.map(result => `${result._id * 100}-${result._id * 100 + 99}`);
          const counts = results.map(result => result.count);
      
          res.status(200).json({ labels, counts });

    } catch (error) {
        console.error('Error generating bar chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const pieChart = async (req, res) => {
    try {
        const { month } = req.query;



        const selectedMonth = parseInt(month);

        // Aggregate to get the count of items for each category in the selected month
        const pieChartData = await Transaction.aggregate([
            {
                $addFields: {
                    saleMonth: { $month: '$dateOfSale' }
                }
            },
            {
                $match: {
                    saleMonth: selectedMonth
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Prepare response in the format: category name -> count
        const pieChartResponse = {};
        pieChartData.forEach(item => {
            pieChartResponse[item._id] = item.count;
        });

        res.status(200).json(pieChartResponse);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const combinedData = async (req, res) => {
    const { month } = req.query;

    const selectedM = parseInt(month);

    const fetchStatistics = async () => {
        return await axios.get(`http://localhost:5000/api/v1/statistics?month=${selectedM}`);
    }

    const fetchBarChartData = async () => {
        return await axios.get(`http://localhost:5000/api/v1/barchart?month=${selectedM}`)
    }

    const fetchPieChartData = async () => {
        return await axios.get(`http://localhost:5000/api/v1/piechart?month=${selectedM}`)
    }

    try {

        const [statisticsResponse, barChartDataResponse, pieChartDataResponse] = await Promise.all([
            fetchStatistics(),
            fetchBarChartData(),
            fetchPieChartData()
        ])

        const combinedData = {
            statistics: statisticsResponse.data,
            barChartData: barChartDataResponse.data,
            pieChartData: pieChartDataResponse.data
        }

        res.status(200).json(combinedData)

    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


