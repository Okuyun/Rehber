class pagination {
    // 
    constructor(total, index = 0) {
        this.index = index;
        this.total = total;
    }


    /**
     * @returns {number}
     */
  
   
    getPageLimit() {
        return this.pageLimit
    }
    setPageLimit(num) {
        this.pageLimit = num;
        this.updateValues();
    }
  
    get min() {
        return this.index * total
    }
    get max() {
        return this.min() + total >= this.pageLimit ? this.pageLimit : this.min() + total;
    }
    getNumberOfPages() {
        return Math.ceil(this.pageLimit / this.total);
    }
    next() {
        this.index++
            if (this.index > this.getNumberOfPages()) this.index = this.getNumberOfPages();
    }
    prev() {
        this.index--
            if (this.index < this.getNumberOfPages()) this.index = 0;

    }
    pages() {
        let steps = this.pageLimit / 2;
        let min = index + steps;
        let max = index - steps;
        if (min < 0) { min = 0 }
        if (max > this.max) { max = this.total }
    }
    updateValues() {
        // https://getbootstrap.com/docs/4.3/layout/overview/#responsive-breakpoints
        let width = window.screen.width;
        //         // Small devices (landscape phones, 576px and up)
        // @media (min-width: 576px) { ... }
        // // Medium devices (tablets, 768px and up)
        // @media (min-width: 768px) { ... }
        // // Large devices (desktops, 992px and up)
        // @media (min-width: 992px) { ... }
        // // Extra large devices (large desktops, 1200px and up)
        // @media (min-width: 1200px) { ... }
        switch (true) {
            case (576 <= width < 768):
                this.pageLimit = 4;
                break;
            case (768 <= width < 992):
                this.pageLimit = 6;
                break;
            case (992 <= width < 1200):
                this.pageLimit = 8;
                break;
            case (1200 <= width):
                this.pageLimit = max();
                break;
        }



    }

}