import type { Event } from "@/types/events"

export const eventListData: Array<Event> = [
  {
    id: 'event-1',
    name: 'Community Charity Gala',
    status: 'Active',
    location: 'Harborview Conference Center, Seattle, WA, 98101',
    coverImage: 'gala_cover.jpg',
    startDate: 'April 12, 2025',
    endDate: 'April 14, 2025',
    description:
      'Join us for an elegant evening of fundraising and community celebration. This annual gala brings together local businesses, philanthropists, and community members to support vital social programs. Enjoy fine dining, live entertainment, and the opportunity to make a real difference in our community.',
    coordinators: [
      { name: 'Sarah Johnson', role: 'Overall-in-Charge' },
      { name: 'Michael Chen', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Emily Rodriguez', role: 'Volunteer' },
      { name: 'James Wilson', role: 'Volunteer' },
      { name: 'Amanda Lee', role: 'Volunteer' },
    ],
  },
  {
    id: 'event-2',
    name: 'Youth Leadership Summit',
    status: 'Active',
    location: 'Northside Innovation Hub, Austin, TX, 78701',
    coverImage: 'summit_cover.jpg',
    startDate: 'May 8, 2025',
    endDate: 'May 9, 2025',
    description:
      'Empowering the next generation of leaders through interactive workshops, mentorship sessions, and networking opportunities. This two-day summit features keynote speakers, skill-building activities, and collaborative projects designed to inspire and equip young leaders.',
    coordinators: [
      { name: 'David Martinez', role: 'Overall-in-Charge' },
      { name: 'Lisa Thompson', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Kevin Patel', role: 'Volunteer' },
      { name: 'Jessica Brown', role: 'Volunteer' },
      { name: 'Ryan Garcia', role: 'Volunteer' },
    ],
  },
  {
    id: 'event-3',
    name: 'Spring Volunteer Drive',
    status: 'Active',
    location: 'Civic Green Park, Denver, CO, 80202',
    coverImage: 'spring_drive.jpg',
    startDate: 'April 20, 2025',
    endDate: 'April 20, 2025',
    description:
      'Help beautify our community! Join fellow volunteers for a day of park cleanup, tree planting, and community gardening. All ages and skill levels welcome. Tools and refreshments provided.',
    coordinators: [
      { name: 'Rachel Green', role: 'Overall-in-Charge' },
      { name: 'Tom Anderson', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Sophie Martinez', role: 'Volunteer' },
      { name: 'Daniel Kim', role: 'Volunteer' },
      { name: 'Maria Santos', role: 'Volunteer' },
    ],
  },
  {
    id: 'event-4',
    name: 'Community Arts Festival',
    status: 'Active',
    location: 'Riverside Pavilion, Portland, OR, 97201',
    coverImage: 'arts_festival.jpg',
    startDate: 'June 2, 2025',
    endDate: 'June 4, 2025',
    description:
      'Celebrate local artists and creativity! This three-day festival showcases paintings, sculptures, live performances, and interactive art installations. Support local talent while enjoying food trucks, music, and family-friendly activities.',
    coordinators: [
      { name: 'Alex Turner', role: 'Overall-in-Charge' },
      { name: 'Nina Patel', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Chris Davis', role: 'Volunteer' },
      { name: 'Emma Wilson', role: 'Volunteer' },
      { name: 'Jordan Lee', role: 'Volunteer' },
    ],
  },
  {
    id: 'event-5',
    name: 'Neighborhood Cleanup Day',
    status: 'Active',
    location: 'Central Plaza, Chicago, IL, 60601',
    coverImage: 'cleanup_day.jpg',
    startDate: 'April 27, 2025',
    endDate: 'April 27, 2025',
    description:
      'Make our neighborhood shine! Volunteers will help clean streets, remove litter, and spruce up public spaces. A great opportunity to meet neighbors and take pride in our community.',
    coordinators: [
      { name: 'Marcus Johnson', role: 'Overall-in-Charge' },
      { name: 'Laura White', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Tyler Brown', role: 'Volunteer' },
      { name: 'Olivia Clark', role: 'Volunteer' },
      { name: 'Nathan Taylor', role: 'Volunteer' },
    ],
  },
  {
    id: 'event-6',
    name: 'Annual Donor Reception',
    status: 'Active',
    location: 'Skyline Terrace, New York, NY, 10001',
    coverImage: 'donor_reception.jpg',
    startDate: 'May 22, 2025',
    endDate: 'May 22, 2025',
    description:
      'An exclusive evening to honor our generous donors and supporters. Enjoy breathtaking city views, gourmet cuisine, and heartfelt recognition of those who make our mission possible.',
    coordinators: [
      { name: 'Victoria Hayes', role: 'Overall-in-Charge' },
      { name: 'Robert Singh', role: 'Assistant-in-Charge' },
    ],
    volunteers: [
      { name: 'Samantha Moore', role: 'Volunteer' },
      { name: 'Andrew Jackson', role: 'Volunteer' },
      { name: 'Isabella Martinez', role: 'Volunteer' },
    ],
  },
]

export const eventData: Event = {
  id: 'default',
  name: 'Event Name',
  status: 'Active',
  location: 'Orchard Central, Somerset, 666666',
  coverImage: 'image123456.jpg',
  startDate: 'July 1, 2025',
  endDate: 'December 31, 2025',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  coordinators: [
    { name: 'Name', role: 'Overall-in-Charge' },
    { name: 'Name', role: 'Assistant-in-Charge' },
  ],
  volunteers: [
    { name: 'Name', role: 'Volunteer' },
    { name: 'Name', role: 'Volunteer' },
    { name: 'Name', role: 'Volunteer' },
  ],
}
