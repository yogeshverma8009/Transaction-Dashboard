

const TransactionData = ({tdata}) => {


  return (
    <>
     {
        tdata.map((data)=>{
            const {_id, title,  description,price,category, sold, image} = data;

            const soldText = sold ? "Sold" : "Available";
            return(
                <tr key={_id}>
                    <td>{_id}</td>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>{price}</td>
                    <td>{category}</td>
                    <td>{soldText}</td>
                    <td><img style={{width:'40%'}} src={image} alt="Item Image" /></td>
                </tr>
            )
        })
     } 
    </>
  )
}

export default TransactionData
