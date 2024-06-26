import { subHours } from 'date-fns';
import * as moment from 'moment-timezone';



export class CustomDate {
    private static instance: CustomDate;
    public static getInstance(): CustomDate {
        if (!CustomDate.instance) {
            CustomDate.instance = new CustomDate();
        }
        return CustomDate.instance;
    }


    getNewDateInTheAmazonTimeZone() {

        return {
            date: moment().tz('America/Manaus'),
            sql_date: moment().tz('America/Manaus').format('yyyy-mm-dd'),
            hour: moment().tz('America/Manaus').format('HH:mm')

        }
    }

    getFinalDateorder() {

        let date = moment().tz('America/Manaus').add(30, 'days')

        if (date.day() === 6) {

            date.add(2, 'days')

        } else if (date.day() === 0) {

            date.add(1, 'days')

        }

        return {
            date: date,
            sql_date: date.format('YYYY-MM-DD'),
            hour: date.format('HH:mm:ss')
        }
    }


    customNewAmDate(time: string) {
        return moment(time).tz('America/Manaus').format('HH:mm');
    }


    newSPDate() {

        return moment().tz('America/Sao_Paulo').format()
    }

    getAMHours(hour: string) {
        return moment(hour).tz('America/Manaus').format()
    }

    getDateAmazonas() {
        const manausTimeOffset = 4; // Manaus está em GMT-4
        const nowInManaus = new Date(); // Data e hora atuais
        return subHours(nowInManaus, manausTimeOffset);
    }




}


