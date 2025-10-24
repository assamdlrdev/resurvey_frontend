


const HelperService = {
    dateComponents: (dte: any = null) => {
        const dateObj = dte !== null ? new Date(dte) : new Date();
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        const date = dateObj.getDate() < 10 ? '0' + (dateObj.getDate()) : dateObj.getDate();
        const hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
        const minutes = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
        const seconds = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();
        const time = dateObj.getTime();
        
        return {
            year: year,
            month: month,
            date: date,
            hour: hour,
            minutes: minutes,
            seconds: seconds,
            time: time
        };

    }
};

export default HelperService;