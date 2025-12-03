import type { Volunteer, VolunteerEvent } from "@/types/vms";

export const volunteerListData: Volunteer[] = [
  {
    id: "m5gr84i9",
    name : "bob",
    age : 20, 
    gender : "Male", 
    language : ["English"], 
    activities : 5, 
    trainings: 6, 
    optin : true,
    certifications : ['First Aid'],
    volunteerHistory : 'hi',
  },
  {
    id: "3u1reuv4",
    name : "alice", 
    age : 20, 
    gender : "Female", 
    language : ["English", "Chinese"], 
    activities : 5, 
    trainings: 7, 
    optin : false,
    certifications : ['-'],
    volunteerHistory : 'hi',
  },
  {
    id: "derv1ws0",
    name : "bob2", 
    age : 15, 
    gender : "Female", 
    language : ["English", "Chinese"], 
    activities : 5, 
    trainings: 6, 
    optin : true,
    certifications : ['-'],
    volunteerHistory : 'hi',
  },
  {
    id: "5kma53ae",
    name : "bob3",
    age : 21, 
    gender : "Male", 
    language : ["English","Malay"], 
    activities : 5, 
    trainings: 6, 
    optin : true,
    certifications : ['-'],
    volunteerHistory : 'hi',
  },
  {
    id: "bhqecj4p",
    name : "bob4",
    age : 15, 
    gender : "Male", 
    activities : 5, 
    trainings: 6, 
    optin : true,
    language : ["English", "Chinese"], 
    certifications : ['-'],
    volunteerHistory : 'hi',
  },
]

export const volunteerEventListData: VolunteerEvent[] = [
  {
    event: 'Volunteer Event One',
    role: 'Volunteer',
    hours: 5,
    time: 230, // Time in 24-hour format (e.g., 2:30 PM)
    date: new Date('2024-03-24'),
  },
  {
    event: 'Community Cleanup',
    role: 'Team Leader',
    hours: 4,
    time: 900, // 9:00 AM
    date: new Date('2024-04-05'),
  },
  {
    event: 'Soup Kitchen Service',
    role: 'Volunteer',
    hours: 3,
    time: 1200, // 12:00 PM
    date: new Date('2024-05-10'),
  },
  {
    event: 'Charity Run',
    role: 'Volunteer',
    hours: 6,
    time: 1500, // 3:00 PM
    date: new Date('2024-06-14'),
  },
  {
    event: 'Environmental Awareness Campaign',
    role: 'Speaker',
    hours: 2,
    time: 1030, // 10:30 AM
    date: new Date('2024-07-21'),
  },
  {
    event: 'Food Drive',
    role: 'Volunteer',
    hours: 4,
    time: 1800, // 6:00 PM
    date: new Date('2024-08-02'),
  },
  {
    event: 'Senior Assistance Program',
    role: 'Volunteer',
    hours: 3,
    time: 1100, // 11:00 AM
    date: new Date('2024-09-12'),
  },
  {
    event: 'Homeless Shelter Help',
    role: 'Coordinator',
    hours: 5,
    time: 1400, // 2:00 PM
    date: new Date('2024-10-07'),
  },
  {
    event: 'Health and Wellness Workshop',
    role: 'Volunteer',
    hours: 2,
    time: 1600, // 4:00 PM
    date: new Date('2024-11-19'),
  },
  {
    event: 'Holiday Gift Wrapping',
    role: 'Volunteer',
    hours: 3,
    time: 1500, // 3:00 PM
    date: new Date('2024-12-05'),
  },
]
