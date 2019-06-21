import React, { Component } from 'react';
import '../App/styles/management.css'
import 'bootstrap/dist/css/bootstrap.css';

class CategoryItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
        id: props.id,
        name: props.name,
        select: props.select
      }
    }

    onItemClick = () => {
        this.setState({
            select: true
        });
        this.props.categorySelect(this.state.id);
    }

    onItemDoubleClick = () => {
        this.setState({
            select: true
        });
        this.props.categoryOpen(this.state.id, this.state.name);
    }

    componentDidMount() {

    }
  
    render() {

        let categoryItemClass = this.props.select ? "category_item_select" : "category_item";
        let categoryName = this.props.name ? this.props.name: this.state.name;
        return (
            <div className={categoryItemClass} onClick={this.onItemClick} onDoubleClick={this.onItemDoubleClick}>
                <p className="category_text disable-selection">{categoryName}</p>
            </div>
        );
    }
  }
  export default CategoryItem;