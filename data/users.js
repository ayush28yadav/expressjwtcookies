// Demo users use bcrypt hashes generated with a work factor of 12.
const users = [
    { id: 1, username: "ayush", password: "$2b$12$Y3QcMKWqktD76JZZv1TWdu/sL6J4s2myQzHIz/V2N/NsB50RM8Rfi", role: "admin" },
    { id: 2, username: "rahul", password: "$2b$12$YzD6t9DA4EbmMs.aSBHjh.kOJlc4vVZRdnz/lqP.ahXvxNN/pRmxG", role: "user" },
    { id: 3, username: "priya", password: "$2b$12$SsIPRQSTk0mrYkZKV3m7luT/G7rEk7xoAyZl0navBIy3qDBARMrPi", role: "user" },
    { id: 4, username: "aman", password: "$2b$12$JNQ.fABJU7brw8L.4a7DX.gG9B261l9suyiyqHiqswBcVaLDU.OLa", role: "user" },
    { id: 5, username: "neha", password: "$2b$12$99jhWSvWQvVHHwjQXJ2Jj.b0bCCrF.O6Hm5YvoLZjbWJ7fYKy7WUC", role: "moderator" }
];

module.exports = users;
