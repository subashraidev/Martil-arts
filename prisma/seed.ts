import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.announcement.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.trialRequest.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.beltProgress.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.program.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users & Profiles
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const instructorPassword = await bcrypt.hash("instructor123", saltRounds);
  const studentPassword = await bcrypt.hash("student123", saltRounds);

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@tkd.com",
      password: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          firstName: "Grand",
          lastName: "Master Kim",
          dob: "1970-05-15",
          age: 56,
          gender: "Male",
          phone: "972-555-0199",
          address: "2154 S State Hwy 121, Lewisville, TX",
          emergencyContact: "972-555-0100 (Wife)",
          currentBelt: "Black (9th Dan)",
          membershipStatus: "Active",
          membershipType: "Family",
        },
      },
    },
  });

  // 2. Instructors
  const instructor1 = await prisma.user.create({
    data: {
      email: "jihoon@tkd.com",
      password: instructorPassword,
      role: "INSTRUCTOR",
      profile: {
        create: {
          firstName: "Ji-hoon",
          lastName: "Kim",
          dob: "1988-08-20",
          age: 38,
          gender: "Male",
          phone: "469-555-0144",
          address: "1200 Mill St, Lewisville, TX",
          emergencyContact: "469-555-0100 (Father)",
          currentBelt: "Black (5th Dan)",
          membershipStatus: "Active",
          membershipType: "Monthly",
        },
      },
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      email: "sarah@tkd.com",
      password: instructorPassword,
      role: "INSTRUCTOR",
      profile: {
        create: {
          firstName: "Sarah",
          lastName: "Conner",
          dob: "1992-03-12",
          age: 34,
          gender: "Female",
          phone: "214-555-0155",
          address: "450 Bellaire Blvd, Lewisville, TX",
          emergencyContact: "214-555-0102 (Brother)",
          currentBelt: "Black (3rd Dan)",
          membershipStatus: "Active",
          membershipType: "Monthly",
        },
      },
    },
  });

  // 3. Students
  const studentsData = [
    {
      email: "alex@tkd.com",
      firstName: "Alex",
      lastName: "Mercer",
      dob: "2015-06-10",
      age: 11,
      gender: "Male",
      parentName: "Richard Mercer",
      phone: "972-555-0211",
      address: "102 Larkspur Dr, Lewisville, TX",
      emergencyContact: "Richard Mercer - 972-555-0211",
      currentBelt: "Green",
      beltProgressPercentage: 65,
      membershipType: "Monthly",
      preferredSchedule: "Tue/Thu 4:30 PM",
    },
    {
      email: "chloe@tkd.com",
      firstName: "Chloe",
      lastName: "Zhao",
      dob: "2018-09-04",
      age: 7,
      gender: "Female",
      parentName: "Min Zhao",
      phone: "469-555-0222",
      address: "508 Summit Ridge, Lewisville, TX",
      emergencyContact: "Min Zhao - 469-555-0222",
      currentBelt: "Yellow",
      beltProgressPercentage: 40,
      membershipType: "Quarterly",
      preferredSchedule: "Mon/Wed 4:00 PM",
    },
    {
      email: "brandon@tkd.com",
      firstName: "Brandon",
      lastName: "Stark",
      dob: "2009-01-15",
      age: 17,
      gender: "Male",
      parentName: "Ned Stark",
      phone: "214-555-0233",
      address: "800 Winterfell Way, Lewisville, TX",
      emergencyContact: "Ned Stark - 214-555-0233",
      currentBelt: "Red",
      beltProgressPercentage: 80,
      membershipType: "Semi-Annual",
      preferredSchedule: "Mon/Wed/Fri 5:30 PM",
    },
    {
      email: "emma@tkd.com",
      firstName: "Emma",
      lastName: "Watson",
      dob: "1998-11-23",
      age: 27,
      gender: "Female",
      parentName: "",
      phone: "972-555-0244",
      address: "1500 Meadow Rd, Lewisville, TX",
      emergencyContact: "Dan Watson - 972-555-0240",
      currentBelt: "Black (1st Dan)",
      beltProgressPercentage: 20,
      membershipType: "Annual",
      preferredSchedule: "Mon/Wed/Fri 7:00 PM",
    },
    {
      email: "daniel@tkd.com",
      firstName: "Daniel",
      lastName: "LaRusso",
      dob: "2005-04-18",
      age: 21,
      gender: "Male",
      parentName: "Lucille LaRusso",
      phone: "469-555-0255",
      address: "123 Bonsai Ln, Lewisville, TX",
      emergencyContact: "Lucille LaRusso - 469-555-0250",
      currentBelt: "Brown",
      beltProgressPercentage: 90,
      membershipType: "Monthly",
      preferredSchedule: "Mon/Wed/Fri 7:00 PM",
    },
  ];

  const students: any[] = [];
  for (const s of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        password: studentPassword,
        role: "STUDENT",
        profile: {
          create: {
            firstName: s.firstName,
            lastName: s.lastName,
            parentName: s.parentName || null,
            dob: s.dob,
            age: s.age,
            gender: s.gender,
            phone: s.phone,
            address: s.address,
            emergencyContact: s.emergencyContact,
            currentBelt: s.currentBelt,
            beltProgressPercentage: s.beltProgressPercentage,
            membershipType: s.membershipType,
            preferredSchedule: s.preferredSchedule,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    students.push(user);
  }

  // Create Programs
  const programsData = [
    {
      name: "Tiny Tigers",
      description: "Introduce preschool children to focus, discipline, and motor skills through fun Taekwondo play.",
      ageGroup: "3 - 5 Years",
      benefits: "Focus, Coordination, Respect, Confidence, Balance",
      schedule: "Mon/Wed 4:00 PM – 4:45 PM",
      instructorName: "Sarah Conner",
      pricing: 120.0,
      slug: "tiny-tigers",
    },
    {
      name: "Kids Taekwondo",
      description: "Dynamic training focusing on physical fitness, bully prevention, character building, and belt progression.",
      ageGroup: "6 - 12 Years",
      benefits: "Self-Defense, Fitness, Self-Discipline, Focus, Integrity",
      schedule: "Tue/Thu 4:30 PM – 5:30 PM",
      instructorName: "Ji-hoon Kim",
      pricing: 150.0,
      slug: "kids-taekwondo",
    },
    {
      name: "Teen Classes",
      description: "Advanced fitness, sparring, leadership skills, and goal setting designed specifically for teenagers.",
      ageGroup: "13 - 17 Years",
      benefits: "Confidence, Core Strength, Stress Relief, Leadership, Goal Setting",
      schedule: "Mon/Wed/Fri 5:30 PM – 6:30 PM",
      instructorName: "Ji-hoon Kim",
      pricing: 160.0,
      slug: "teen-classes",
    },
    {
      name: "Adult Classes",
      description: "Great workout combined with traditional martial arts, practical self-defense, and stress reduction.",
      ageGroup: "18+ Years",
      benefits: "Cardio, Flexibility, Practical Defense, Stress Relief, Camaraderie",
      schedule: "Mon/Wed/Fri 7:00 PM – 8:00 PM",
      instructorName: "Ji-hoon Kim",
      pricing: 170.0,
      slug: "adult-classes",
    },
    {
      name: "Competition Team",
      description: "Specialized training for Olympic-style sparring tournaments and form exhibitions.",
      ageGroup: "8+ Years",
      benefits: "Advanced Sparring, Athletic Conditioning, Agility, Competitive Success",
      schedule: "Fri 6:30 PM – 8:00 PM, Sat 10:00 AM – 11:30 AM",
      instructorName: "Grand Master Kim",
      pricing: 200.0,
      slug: "competition-team",
    },
    {
      name: "Black Belt Leadership Program",
      description: "Elite course focusing on assistant instructing, advanced weapons training, and community service.",
      ageGroup: "10+ Years",
      benefits: "Public Speaking, Mentorship, Advanced Forms, Character Excellence",
      schedule: "Saturday 12:00 PM – 1:30 PM",
      instructorName: "Grand Master Kim",
      pricing: 180.0,
      slug: "black-belt-leadership",
    },
  ];

  const programs: any[] = [];
  for (const p of programsData) {
    const prog = await prisma.program.create({
      data: p,
    });
    programs.push(prog);
  }

  // Create Classes
  const classesData = [
    {
      name: "Tiny Tigers Mon",
      programSlug: "tiny-tigers",
      dayOfWeek: "Monday",
      startTime: "16:00",
      endTime: "16:45",
      instructorId: instructor2.id,
    },
    {
      name: "Tiny Tigers Wed",
      programSlug: "tiny-tigers",
      dayOfWeek: "Wednesday",
      startTime: "16:00",
      endTime: "16:45",
      instructorId: instructor2.id,
    },
    {
      name: "Kids TKD Tue",
      programSlug: "kids-taekwondo",
      dayOfWeek: "Tuesday",
      startTime: "16:30",
      endTime: "17:30",
      instructorId: instructor1.id,
    },
    {
      name: "Kids TKD Thu",
      programSlug: "kids-taekwondo",
      dayOfWeek: "Thursday",
      startTime: "16:30",
      endTime: "17:30",
      instructorId: instructor1.id,
    },
    {
      name: "Teen TKD Mon",
      programSlug: "teen-classes",
      dayOfWeek: "Monday",
      startTime: "17:30",
      endTime: "18:30",
      instructorId: instructor1.id,
    },
    {
      name: "Teen TKD Wed",
      programSlug: "teen-classes",
      dayOfWeek: "Wednesday",
      startTime: "17:30",
      endTime: "18:30",
      instructorId: instructor1.id,
    },
    {
      name: "Teen TKD Fri",
      programSlug: "teen-classes",
      dayOfWeek: "Friday",
      startTime: "17:30",
      endTime: "18:30",
      instructorId: instructor1.id,
    },
    {
      name: "Adult TKD Mon",
      programSlug: "adult-classes",
      dayOfWeek: "Monday",
      startTime: "19:00",
      endTime: "20:00",
      instructorId: instructor1.id,
    },
    {
      name: "Adult TKD Wed",
      programSlug: "adult-classes",
      dayOfWeek: "Wednesday",
      startTime: "19:00",
      endTime: "20:00",
      instructorId: instructor1.id,
    },
    {
      name: "Adult TKD Fri",
      programSlug: "adult-classes",
      dayOfWeek: "Friday",
      startTime: "19:00",
      endTime: "20:00",
      instructorId: instructor1.id,
    },
    {
      name: "Competition Sparring Fri",
      programSlug: "competition-team",
      dayOfWeek: "Friday",
      startTime: "18:30",
      endTime: "20:00",
      instructorId: admin.id,
    },
    {
      name: "Competition Conditioning Sat",
      programSlug: "competition-team",
      dayOfWeek: "Saturday",
      startTime: "10:00",
      endTime: "11:30",
      instructorId: admin.id,
    },
  ];

  const classes: any[] = [];
  for (const c of classesData) {
    const prog = programs.find((p) => p.slug === c.programSlug);
    if (prog) {
      const cls = await prisma.class.create({
        data: {
          name: c.name,
          programId: prog.id,
          dayOfWeek: c.dayOfWeek,
          startTime: c.startTime,
          endTime: c.endTime,
          instructorId: c.instructorId,
        },
      });
      classes.push(cls);
    }
  }

  // Enroll Students in Programs
  // Alex -> Kids
  // Chloe -> Tiny Tigers
  // Brandon -> Teen
  // Emma -> Adult
  // Daniel -> Adult + Competition
  const enrollments = [
    { profile: students[0].profile, programSlug: "kids-taekwondo" },
    { profile: students[1].profile, programSlug: "tiny-tigers" },
    { profile: students[2].profile, programSlug: "teen-classes" },
    { profile: students[3].profile, programSlug: "adult-classes" },
    { profile: students[4].profile, programSlug: "adult-classes" },
    { profile: students[4].profile, programSlug: "competition-team" },
  ];

  for (const e of enrollments) {
    const prog = programs.find((p) => p.slug === e.programSlug);
    if (prog && e.profile) {
      await prisma.enrollment.create({
        data: {
          profileId: e.profile.id,
          programId: prog.id,
          status: "Active",
        },
      });
    }
  }

  // Seed Attendance Records for students over the past 3 weeks
  // Let's create dates: Mon, Tue, Wed, Thu, Fri, Sat for past 3 weeks
  const pastDates = [
    "2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04",
    "2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10", "2026-07-11",
    "2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-17", "2026-07-18",
    "2026-07-20",
  ];

  for (const student of students) {
    const prof = student.profile;
    if (!prof) continue;

    // Pick classes that fit their schedule
    const studentClasses = classes.filter((cls) => {
      if (prof.currentBelt === "White" || prof.currentBelt === "Yellow") {
        return cls.name.includes("Tiny Tigers") || cls.name.includes("Kids");
      }
      if (prof.currentBelt === "Green" || prof.currentBelt === "Yellow") {
        return cls.name.includes("Kids");
      }
      if (prof.currentBelt === "Red" || prof.currentBelt === "Brown") {
        return cls.name.includes("Teen") || cls.name.includes("Adult") || cls.name.includes("Competition");
      }
      return cls.name.includes("Adult") || cls.name.includes("Competition");
    });

    for (const d of pastDates) {
      // Find a class on that day of the week
      const dateObj = new Date(d);
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNames[dateObj.getDay()];

      const todaysClass = studentClasses.find((c) => c.dayOfWeek === dayName);
      if (todaysClass) {
        // 80% Present, 10% Late, 10% Absent
        const rand = Math.random();
        let status = "Present";
        if (rand > 0.9) status = "Absent";
        else if (rand > 0.8) status = "Late";

        await prisma.attendance.create({
          data: {
            profileId: prof.id,
            classId: todaysClass.id,
            date: d,
            status: status,
          },
        });
      }
    }
  }

  // Seed Belt Progressions
  // Alex: Green Belt. History: White -> Yellow -> Green
  // Chloe: Yellow Belt. History: White -> Yellow
  // Brandon: Red Belt. History: White -> Yellow -> Green -> Blue -> Purple -> Brown -> Red
  // Emma: Black Belt. History: White -> ... -> Red -> Black
  // Daniel: Brown Belt (Preparing for Red Black)
  const beltHistory = [
    {
      profileId: students[0].profile!.id,
      records: [
        { beltColor: "White", level: "Beginner", status: "Completed", poomsaeForm: "Basic Stances", skillsChecked: '["Stances", "Blocks", "Punch"]', notes: "Excellent focus", promotedAt: new Date("2025-10-01") },
        { beltColor: "Yellow", level: "Beginner", status: "Completed", poomsaeForm: "Taegeuk Il Jang", skillsChecked: '["Front Kick", "Inner Block", "Taegeuk 1"]', notes: "Great kicks", promotedAt: new Date("2026-02-15") },
        { beltColor: "Green", level: "Intermediate", status: "In Progress", poomsaeForm: "Taegeuk Sam Jang", skillsChecked: '["Side Kick", "Back Stance", "Board Breaking"]', notes: "Working hard on board breaking" },
      ],
    },
    {
      profileId: students[1].profile!.id,
      records: [
        { beltColor: "White", level: "Beginner", status: "Completed", poomsaeForm: "Basic Stances", skillsChecked: '["Stances", "Blocks"]', notes: "Very polite", promotedAt: new Date("2026-03-10") },
        { beltColor: "Yellow", level: "Beginner", status: "In Progress", poomsaeForm: "Taegeuk Il Jang", skillsChecked: '["Front Kick"]', notes: "Needs focus on stances" },
      ],
    },
    {
      profileId: students[2].profile!.id,
      records: [
        { beltColor: "White", level: "Beginner", status: "Completed", poomsaeForm: "Basic Stances", skillsChecked: '["All"]', notes: "", promotedAt: new Date("2024-01-10") },
        { beltColor: "Yellow", level: "Beginner", status: "Completed", poomsaeForm: "Taegeuk Il Jang", skillsChecked: '["All"]', notes: "", promotedAt: new Date("2024-05-15") },
        { beltColor: "Green", level: "Intermediate", status: "Completed", poomsaeForm: "Taegeuk Ee Jang", skillsChecked: '["All"]', notes: "", promotedAt: new Date("2024-09-20") },
        { beltColor: "Blue", level: "Intermediate", status: "Completed", poomsaeForm: "Taegeuk Sa Jang", skillsChecked: '["All"]', notes: "", promotedAt: new Date("2025-01-22") },
        { beltColor: "Purple", level: "Intermediate", status: "Completed", poomsaeForm: "Taegeuk Oh Jang", skillsChecked: '["All"]', notes: "", promotedAt: new Date("2025-06-18") },
        { beltColor: "Brown", level: "Advanced", status: "Completed", poomsaeForm: "Taegeuk Yuk Jang", skillsChecked: '["All"]', notes: "A natural competitor", promotedAt: new Date("2025-11-12") },
        { beltColor: "Red", level: "Advanced", status: "In Progress", poomsaeForm: "Taegeuk Chil Jang", skillsChecked: '["Spinning Kick", "Advanced Sparring"]', notes: "Preparing for black stripe test" },
      ],
    },
    {
      profileId: students[3].profile!.id,
      records: [
        { beltColor: "Red", level: "Advanced", status: "Completed", poomsaeForm: "Taegeuk Pal Jang", skillsChecked: '["All"]', notes: "Ready for Black Belt", promotedAt: new Date("2025-08-10") },
        { beltColor: "Black (1st Dan)", level: "Black Belt", status: "Completed", poomsaeForm: "Koryo", skillsChecked: '["All", "Assistant Teaching"]', notes: "Certified by Kukkiwon", promotedAt: new Date("2026-04-05") },
      ],
    },
    {
      profileId: students[4].profile!.id,
      records: [
        { beltColor: "Brown", level: "Advanced", status: "Completed", poomsaeForm: "Taegeuk Chil Jang", skillsChecked: '["All"]', notes: "Strong defense", promotedAt: new Date("2025-12-05") },
        { beltColor: "Red", level: "Advanced", status: "In Progress", poomsaeForm: "Taegeuk Pal Jang", skillsChecked: '["Board Breaking", "Sparring"]', notes: "Needs validation on forms" },
      ],
    },
  ];

  for (const bh of beltHistory) {
    for (const rec of bh.records) {
      await prisma.beltProgress.create({
        data: {
          profileId: bh.profileId,
          beltColor: rec.beltColor,
          level: rec.level,
          status: rec.status,
          skillsChecked: rec.skillsChecked,
          poomsaeForm: rec.poomsaeForm,
          instructorNotes: rec.notes || null,
          promotedAt: rec.promotedAt || null,
          certificateUrl: rec.status === "Completed" ? `/certificates/cert_${bh.profileId}_${rec.beltColor.replace(" ", "_")}.pdf` : null,
        },
      });
    }
  }

  // Seed Payments
  // Create payments for past few months for each student
  const paymentDetails = [
    { userId: students[0].id, amount: 150.0, date: "2026-05-01", method: "Stripe", status: "Paid", invoiceNumber: "TKD-2026-0001", desc: "May Kids Program Tuition" },
    { userId: students[0].id, amount: 150.0, date: "2026-06-01", method: "Stripe", status: "Paid", invoiceNumber: "TKD-2026-0006", desc: "June Kids Program Tuition" },
    { userId: students[0].id, amount: 150.0, date: "2026-07-01", method: "Stripe", status: "Paid", invoiceNumber: "TKD-2026-0011", desc: "July Kids Program Tuition" },

    { userId: students[1].id, amount: 360.0, date: "2026-04-01", method: "Credit Card", status: "Paid", invoiceNumber: "TKD-2026-0002", desc: "Q2 Tiny Tigers Tuition" },
    { userId: students[1].id, amount: 360.0, date: "2026-07-01", method: "Credit Card", status: "Paid", invoiceNumber: "TKD-2026-0012", desc: "Q3 Tiny Tigers Tuition" },

    { userId: students[2].id, amount: 480.0, date: "2026-02-01", method: "Cash", status: "Paid", invoiceNumber: "TKD-2026-0003", desc: "Semi-Annual Teen Program" },

    { userId: students[3].id, amount: 1500.0, date: "2026-01-10", method: "Stripe", status: "Paid", invoiceNumber: "TKD-2026-0004", desc: "Annual Adult Program" },

    { userId: students[4].id, amount: 170.0, date: "2026-05-01", method: "PayPal", status: "Paid", invoiceNumber: "TKD-2026-0005", desc: "May Adult Tuition" },
    { userId: students[4].id, amount: 170.0, date: "2026-06-01", method: "PayPal", status: "Paid", invoiceNumber: "TKD-2026-0007", desc: "June Adult Tuition" },
    { userId: students[4].id, amount: 170.0, date: "2026-07-01", method: "PayPal", status: "Paid", invoiceNumber: "TKD-2026-0013", desc: "July Adult Tuition" },
    { userId: students[4].id, amount: 200.0, date: "2026-07-05", method: "Cash", status: "Paid", invoiceNumber: "TKD-2026-0015", desc: "July Competition Team Add-on" },
  ];

  for (const pay of paymentDetails) {
    await prisma.payment.create({
      data: {
        userId: pay.userId,
        amount: pay.amount,
        date: pay.date,
        method: pay.method,
        status: pay.status,
        invoiceNumber: pay.invoiceNumber,
        description: pay.desc,
      },
    });
  }

  // Seed Free Trial Requests
  const trialRequests = [
    {
      name: "Marcus Aurelius",
      age: 9,
      parentName: "Julius Aurelius",
      phone: "214-555-9011",
      email: "julius@aurelius.com",
      preferredDate: "2026-07-22",
      preferredTime: "16:30",
      experience: "None",
      notes: "Extremely energetic child, looking to build focus.",
      status: "Pending",
    },
    {
      name: "Bruce Wayne",
      age: 28,
      parentName: null,
      phone: "972-555-4321",
      email: "bruce@gotham.co",
      preferredDate: "2026-07-24",
      preferredTime: "19:00",
      experience: "Ju-Jitsu and Karate",
      notes: "Looking to study high-kicking and agility.",
      status: "Pending",
    },
    {
      name: "Jimmy Hopkins",
      age: 14,
      parentName: "Mable Hopkins",
      phone: "469-555-1122",
      email: "mable@hopkins.net",
      preferredDate: "2026-07-15",
      preferredTime: "17:30",
      experience: "Wrestling",
      notes: "Struggling with discipline at school.",
      status: "Completed",
      assignedInstructorId: instructor1.id,
    },
  ];

  for (const tr of trialRequests) {
    await prisma.trialRequest.create({
      data: tr,
    });
  }

  // Seed Contact Messages
  const contactMessages = [
    {
      name: "Jennifer Aniston",
      email: "jenny@friends.com",
      phone: "310-555-9988",
      subject: "Group Rates for Corporate Seminars",
      message: "Hello! Do you offer self-defense workshops for corporate teams? We have a group of 15-20 people in Lewisville.",
      status: "Unread",
    },
    {
      name: "Robert Downey",
      email: "rdj@tonystark.com",
      phone: "212-555-3000",
      subject: "Private lessons with Master Kim",
      message: "Hi, I would like to inquire about Grand Master Kim's availability for private training in the morning.",
      status: "Read",
    },
  ];

  for (const msg of contactMessages) {
    await prisma.contactMessage.create({
      data: msg,
    });
  }

  // Seed Blog Posts
  const blogPosts = [
    {
      title: "The Tenets of Taekwondo: Building Character On & Off the Mat",
      slug: "tenets-of-taekwondo",
      summary: "Explore the five fundamental tenets of Taekwondo—Courtesy, Integrity, Perseverance, Self-Control, and Indomitable Spirit—and how they shape student success in everyday life.",
      content: `Taekwondo is much more than a set of physical movements, kicks, and strikes. At its heart, Taekwondo is a philosophy and a way of life designed to foster personal excellence. In every traditional school, students are taught to memorize and live by the **Five Tenets of Taekwondo**:

### 1. Courtesy (Ye Ui)
Courtesy means showing respect to instructors, seniors, classmates, and oneself. It is demonstrated through bowing, using respectful language, and showing kindness to everyone.

### 2. Integrity (Yeom Chi)
Integrity is the ability to distinguish between right and wrong, and to stand by what is right, even when it is difficult. In Taekwondo, this means training honestly, avoiding cheating, and taking responsibility for one's actions.

### 3. Perseverance (In Nae)
Perseverance is the determination to keep going, even when faced with significant challenges. Whether trying to master a difficult spinning kick or preparing for a grueling belt testing, a student must never give up.

### 4. Self-Control (Geuk Gi)
Self-Control is vital both inside and outside the dojang. In sparring, it means controlling your power and temper to prevent injury to your partner. In daily life, it means controlling emotions, habits, and impulses.

### 5. Indomitable Spirit (Baekjul Boolgool)
Indomitable Spirit is the courage to stand up for your beliefs and maintain confidence, no matter how intimidating the odds. It is the quality that helps a martial artist rise after a defeat and try again.

By incorporating these tenets into daily life, students develop strong character, earn respect, and become leaders in their schools, workplaces, and communities.`,
      category: "Philosophy",
      tags: "Tenets, Philosophy, Character, Guide",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      authorId: admin.id,
    },
    {
      title: "Bullies Beware: How Martial Arts Empowers Kids",
      slug: "martial-arts-prevents-bullying",
      summary: "How Taekwondo training provides children with the confidence, awareness, and de-escalation skills to handle bullying without turning to violence.",
      content: `Bullying is a major concern for parents, schools, and children. While many think that martial arts training teaches kids how to fight, the truth is quite the opposite: **Taekwondo teaches kids how NOT to fight.**

Here is how Taekwondo empowers children to overcome and deter bullying:

### 1. Building Unshakeable Confidence
Bullies typically target kids who appear vulnerable, quiet, or insecure. Taekwondo training improves posture, voice projection, and self-worth. A confident child who stands tall and speaks with authority is far less likely to be targeted by bullies.

### 2. Teaching Verbal De-Escalation
In our kids classes, we teach students how to use their voices to establish boundaries. Phrases like, "Stop, do not touch me," or "I am walking away now," spoken with confidence, can shut down a confrontation before it starts.

### 3. Developing Situational Awareness
Students learn to pay attention to their surroundings, identifying potential hazards and avoiding unsafe situations. Awareness is the first line of defense.

### 4. Practical Self-Defense as a Last Resort
If physical contact is made, Taekwondo teaches block-and-escape techniques. Our goal is always safety and escape, not winning a fight. Knowing they can defend themselves reduces fear and anxiety, making children calmer and more collected.

Our academy is dedicated to nurturing peaceful leaders. Talk to our instructors today about how our programs can support your child's confidence.`,
      category: "Parenting",
      tags: "Bullying, Confidence, Kids, Self-Defense",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
      authorId: instructor1.id,
    },
  ];

  for (const bp of blogPosts) {
    await prisma.blogPost.create({
      data: bp,
    });
  }

  // Seed Gallery Items
  const galleryItems = [
    { url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800", type: "image", album: "Classes", title: "Kids High Kick Training" },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", type: "image", album: "Classes", title: "Adult Stretching Session" },
    { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800", type: "image", album: "Belt Promotion", title: "Yellow Belt Promotion Group" },
    { url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800", type: "image", album: "Tournaments", title: "Sparring Competition Lewisville 2026" },
  ];

  for (const gi of galleryItems) {
    await prisma.galleryItem.create({
      data: gi,
    });
  }

  // Seed Announcements
  const announcements = [
    {
      title: "July Belt Testing Schedule",
      content: "The upcoming belt promotion testing will take place on Saturday, July 25th at 2:00 PM. Please make sure your test sheets are signed and submitted to the front desk by Thursday, July 23rd.",
      target: "students",
      authorId: admin.id,
    },
    {
      title: "Instructor Meeting This Friday",
      content: "There will be a brief staff alignment meeting this Friday at 2:30 PM in the instructor lounge. We will discuss the new curriculum layout.",
      target: "instructors",
      authorId: admin.id,
    },
  ];

  for (const ann of announcements) {
    await prisma.announcement.create({
      data: ann,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
