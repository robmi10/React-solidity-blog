import React, {component} from 'react'

class Paginations extends React.Component{
    render(){
        const{ postPergPage, totalPosts, paginates, nextPage, prevPage} = this.props;
        
        const pageNumbers = [];

        for(let i = 1; i < Math.ceil(totalPosts / postPergPage); i++){
            pageNumbers.push(i);
        }

        return(
            <nav>
                <ul className = "pagination justify-content-center">
                    <li className="page-item" >
                        <a className = "page-link" href = "#" onClick= {() => prevPage}> Previous</a>
                    </li>

                    {pageNumbers.map(num => (
                        <li className="page-item" key = {num}>
                          
                            <a onClick={() => paginates(num)}className = "page-link" href ="#" >{num}</a>
                        </li>
                    ))}

                       

                    <li className="page-item" >
                        <a className = "page-link" href = "#" onClick= {() => nextPage}> Next</a>
                    </li>

                </ul>
            </nav>
        )

    }
}
export default Paginations ;