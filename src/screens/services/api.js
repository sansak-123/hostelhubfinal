let complaints = [];

export const submitComplaint = (complaint) => {
  const newComplaint = {
    id: Date.now().toString(),
    status: "pending",
    ...complaint,
  };

  complaints.push(newComplaint);
  return newComplaint;
};

export const getComplaints = () => {
  return complaints;
};

export const resolveComplaint = (id) => {
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, status: "resolved" } : c
  );
};