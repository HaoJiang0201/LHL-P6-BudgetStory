import React, { Component } from 'react';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Button,Form } from 'react-bootstrap';

class CategoryItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
        select: false
      }
    }

    onItemClick = () => {
        this.setState({
            select: true
        });
    }
  
    componentDidMount() {

    }
  
    render() {
        let categoryItemClass = this.state.select ? "category_item_select" : "category_item";
        return (
            <div className={categoryItemClass} onClick={this.onItemClick}>
                {/* <Button className="category_item_btn" variant="outline-light" onClick={this.onItemClick}> */}
                    <p className="category_text">分类名称{this.props.name}</p>
                {/* </Button> */}
          
            </div>
        );
    }
  }
  export default CategoryItem;