import moment from 'moment';

export default function formatDate(d, format = 'DD.MM HH:mm:ss') {
    if (!d) {
        return '';
    }
    return moment(d).format(format);
}