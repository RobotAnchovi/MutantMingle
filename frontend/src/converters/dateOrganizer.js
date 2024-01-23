const sortAsc = (dates) => {
  return dates.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};

const sortDesc = (dates) => {
  return dates.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};

const pastDates = (dates) => {
  return dates.filter(
    (event) => new Date(event.startDate).getTime() <= Date.now()
  );
};

const futureDates = (dates) => {
  return dates.filter(
    (event) => new Date(event.startDate).getTime() > Date.now()
  );
};

export const sortAscFuture = (dates) => {
  return sortAsc(futureDates(dates));
};

export const sortDescPast = (dates) => {
  return sortDesc(pastDates(dates));
};
