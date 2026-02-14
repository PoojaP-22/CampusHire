import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Company from './models/Company.js';
import StudentProfile from './models/StudentProfile.js';
import Drive from './models/Drive.js';
import Application from './models/Application.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-hire';

// ─── Helpers ───
const hash = async (pw) => bcrypt.hash(pw, 10);

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      StudentProfile.deleteMany({}),
      Drive.deleteMany({}),
      Application.deleteMany({})
    ]);
    console.log('Cleared existing data');

    const pw = await hash('Password@123');

    // ─── 1. ADMIN ───
    const admin = await User.create({
      name: 'Admin User', email: 'admin@campushire.com', password: pw,
      role: 'admin', phone: '9000000001', isApproved: true, isVerified: true
    });

    // ─── 2. TPO ───
    const tpo = await User.create({
      name: 'Dr. Rajesh Kumar', email: 'tpo@campushire.com', password: pw,
      role: 'tpo', phone: '9000000002', isApproved: true, isVerified: true
    });

    // ─── 3. COMPANIES (5) ───
    const companyData = [
      { name: 'TCS HR', email: 'hr@tcs.com', company: 'Tata Consultancy Services', type: 'MNC', industry: 'IT/Software', hrName: 'Priya Sharma', desc: 'Leading global IT services and consulting company.', website: 'https://www.tcs.com', city: 'Mumbai', employees: '1000+' },
      { name: 'Infosys HR', email: 'hr@infosys.com', company: 'Infosys Limited', type: 'MNC', industry: 'IT/Software', hrName: 'Ankit Mehta', desc: 'Global leader in next-generation digital services.', website: 'https://www.infosys.com', city: 'Bangalore', employees: '1000+' },
      { name: 'Wipro HR', email: 'hr@wipro.com', company: 'Wipro Technologies', type: 'MNC', industry: 'IT/Software', hrName: 'Neha Gupta', desc: 'Leading technology services and consulting company.', website: 'https://www.wipro.com', city: 'Bangalore', employees: '1000+' },
      { name: 'Deloitte HR', email: 'hr@deloitte.com', company: 'Deloitte India', type: 'MNC', industry: 'Consulting', hrName: 'Rahul Verma', desc: 'Global professional services network providing audit, consulting, and advisory.', website: 'https://www.deloitte.com', city: 'Hyderabad', employees: '1000+' },
      { name: 'Razorpay HR', email: 'hr@razorpay.com', company: 'Razorpay', type: 'Startup', industry: 'Finance', hrName: 'Kavya Nair', desc: 'Full-stack payments and banking platform for businesses.', website: 'https://www.razorpay.com', city: 'Bangalore', employees: '501-1000' },
    ];

    const companyUsers = [];
    const companies = [];
    for (const c of companyData) {
      const user = await User.create({
        name: c.name, email: c.email, password: pw,
        role: 'company', phone: '90000000' + (companyUsers.length + 10).toString().slice(-2),
        isApproved: true, isVerified: true
      });
      const comp = await Company.create({
        user: user._id, companyName: c.company, companyType: c.type,
        industry: c.industry, description: c.desc, website: c.website,
        hrName: c.hrName, hrEmail: c.email,
        headquarters: { city: c.city, state: c.city, country: 'India' },
        employeeCount: c.employees, isVerified: true, totalDrivesPosted: 0
      });
      companyUsers.push(user);
      companies.push(comp);
    }
    console.log(`Created ${companies.length} companies`);

    // ─── 4. STUDENTS (15) ───
    const studentData = [
      { name: 'Aarav Patel', email: 'aarav@student.com', roll: 'CS2021001', dept: 'Computer Science', cgpa: 8.9, skills: ['Java', 'Python', 'React', 'MongoDB'], batch: 2025 },
      { name: 'Diya Sharma', email: 'diya@student.com', roll: 'CS2021002', dept: 'Computer Science', cgpa: 9.2, skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'], batch: 2025 },
      { name: 'Arjun Reddy', email: 'arjun@student.com', roll: 'IT2021003', dept: 'Information Technology', cgpa: 7.8, skills: ['JavaScript', 'Node.js', 'Express', 'React'], batch: 2025 },
      { name: 'Ishita Gupta', email: 'ishita@student.com', roll: 'EC2021004', dept: 'Electronics', cgpa: 8.5, skills: ['VLSI', 'Embedded Systems', 'C++', 'Python'], batch: 2025 },
      { name: 'Rohan Mehta', email: 'rohan@student.com', roll: 'CS2021005', dept: 'Computer Science', cgpa: 7.2, skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'], batch: 2025 },
      { name: 'Ananya Singh', email: 'ananya@student.com', roll: 'IT2021006', dept: 'Information Technology', cgpa: 8.1, skills: ['React', 'TypeScript', 'PostgreSQL', 'AWS'], batch: 2025 },
      { name: 'Kabir Joshi', email: 'kabir@student.com', roll: 'ME2021007', dept: 'Mechanical', cgpa: 7.5, skills: ['AutoCAD', 'SolidWorks', 'Python', 'MATLAB'], batch: 2025 },
      { name: 'Priya Nair', email: 'priya@student.com', roll: 'CS2021008', dept: 'Computer Science', cgpa: 9.5, skills: ['Python', 'Deep Learning', 'NLP', 'AWS', 'Docker'], batch: 2025 },
      { name: 'Vikram Rao', email: 'vikram@student.com', roll: 'EE2021009', dept: 'Electrical', cgpa: 7.9, skills: ['Power Systems', 'MATLAB', 'Python', 'PLC'], batch: 2025 },
      { name: 'Sneha Kulkarni', email: 'sneha@student.com', roll: 'CS2022010', dept: 'Computer Science', cgpa: 8.3, skills: ['Flutter', 'Dart', 'Firebase', 'React Native'], batch: 2026 },
      { name: 'Aditya Verma', email: 'aditya@student.com', roll: 'IT2022011', dept: 'Information Technology', cgpa: 7.6, skills: ['Angular', 'Java', 'Spring', 'MongoDB'], batch: 2026 },
      { name: 'Meera Iyer', email: 'meera@student.com', roll: 'EC2022012', dept: 'Electronics', cgpa: 8.7, skills: ['IoT', 'Arduino', 'Raspberry Pi', 'Python'], batch: 2026 },
      { name: 'Harsh Agarwal', email: 'harsh@student.com', roll: 'CE2021013', dept: 'Civil', cgpa: 7.1, skills: ['AutoCAD', 'STAAD Pro', 'MS Project', 'Revit'], batch: 2025 },
      { name: 'Riya Chatterjee', email: 'riya@student.com', roll: 'CS2022014', dept: 'Computer Science', cgpa: 8.8, skills: ['Go', 'Kubernetes', 'Docker', 'AWS', 'Terraform'], batch: 2026 },
      { name: 'Siddharth Das', email: 'sid@student.com', roll: 'IT2022015', dept: 'Information Technology', cgpa: 6.8, skills: ['PHP', 'Laravel', 'MySQL', 'Vue.js'], batch: 2026 },
    ];

    const studentUsers = [];
    const studentProfiles = [];
    for (let i = 0; i < studentData.length; i++) {
      const s = studentData[i];
      const user = await User.create({
        name: s.name, email: s.email, password: pw,
        role: 'student', phone: '98000000' + (i + 10).toString().slice(-2),
        isApproved: true, isVerified: true
      });
      const profile = await StudentProfile.create({
        user: user._id, rollNumber: s.roll, department: s.dept,
        batch: s.batch, semester: s.batch === 2025 ? 8 : 6,
        cgpa: s.cgpa, skills: s.skills,
        tenthPercentage: 75 + Math.random() * 20,
        twelfthPercentage: 70 + Math.random() * 25,
        linkedIn: `https://linkedin.com/in/${s.name.toLowerCase().replace(/ /g, '-')}`,
        github: `https://github.com/${s.name.toLowerCase().replace(/ /g, '')}`,
      });
      studentUsers.push(user);
      studentProfiles.push(profile);
    }
    console.log(`Created ${studentUsers.length} students`);

    // ─── 5. DRIVES (8) ───
    const now = new Date();
    const future = (days) => new Date(now.getTime() + days * 86400000);

    const driveData = [
      {
        company: companies[0]._id, createdBy: tpo._id,
        jobTitle: 'Software Developer', jobDescription: 'Develop and maintain enterprise applications using Java and cloud technologies. Work with agile teams on large-scale projects for global clients.',
        jobType: 'Full-time', category: 'Software Development',
        requiredSkills: ['Java', 'SQL', 'Spring Boot'],
        eligibility: { minCGPA: 7.0, allowedDepartments: ['Computer Science', 'Information Technology'], allowedBatches: [2025], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 700000, max: 900000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Mumbai', workMode: 'Hybrid',
        applicationDeadline: future(30), numberOfPositions: 20,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[1]._id, createdBy: tpo._id,
        jobTitle: 'Systems Engineer', jobDescription: 'Join Infosys as a Systems Engineer and work on cutting-edge projects across domains. Training provided at Mysore campus.',
        jobType: 'Full-time', category: 'Software Development',
        requiredSkills: ['Python', 'Java', 'SQL'],
        eligibility: { minCGPA: 6.5, allowedDepartments: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical'], allowedBatches: [2025], allowBacklogs: true, maxBacklogs: 1 },
        salary: { min: 650000, max: 800000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Bangalore', workMode: 'On-site',
        applicationDeadline: future(25), numberOfPositions: 50,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[2]._id, createdBy: tpo._id,
        jobTitle: 'Full Stack Developer', jobDescription: 'Build modern web applications using React and Node.js. Work on customer-facing products with a focus on performance and UX.',
        jobType: 'Full-time', category: 'Web Development',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        eligibility: { minCGPA: 7.5, allowedDepartments: ['Computer Science', 'Information Technology'], allowedBatches: [2025], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 800000, max: 1000000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Bangalore', workMode: 'Hybrid',
        applicationDeadline: future(20), numberOfPositions: 10,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[3]._id, createdBy: tpo._id,
        jobTitle: 'Analyst Intern', jobDescription: 'Summer internship in the consulting division. Analyze business data, prepare reports, and assist with client engagements.',
        jobType: 'Internship', category: 'Business Analyst',
        requiredSkills: ['Excel', 'SQL', 'Communication'],
        eligibility: { minCGPA: 7.0, allowedDepartments: ['All'], allowedBatches: [2026], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 40000, max: 50000, currency: 'INR', period: 'Per Month' },
        jobLocation: 'Hyderabad', workMode: 'On-site',
        applicationDeadline: future(15), numberOfPositions: 5,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[4]._id, createdBy: tpo._id,
        jobTitle: 'Backend Engineer', jobDescription: 'Design and build highly scalable payment APIs. Work on microservices handling millions of transactions daily.',
        jobType: 'Full-time', category: 'Software Development',
        requiredSkills: ['Go', 'Docker', 'Kubernetes', 'AWS'],
        eligibility: { minCGPA: 8.0, allowedDepartments: ['Computer Science', 'Information Technology'], allowedBatches: [2025], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 1200000, max: 1800000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Bangalore', workMode: 'Hybrid',
        applicationDeadline: future(18), numberOfPositions: 3,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[0]._id, createdBy: tpo._id,
        jobTitle: 'Data Science Intern', jobDescription: 'Work with the analytics team on ML models for business process automation.',
        jobType: 'Internship', category: 'Data Science',
        requiredSkills: ['Python', 'Machine Learning', 'Pandas'],
        eligibility: { minCGPA: 8.0, allowedDepartments: ['Computer Science', 'Information Technology'], allowedBatches: [2026], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 35000, max: 45000, currency: 'INR', period: 'Per Month' },
        jobLocation: 'Chennai', workMode: 'Remote',
        applicationDeadline: future(22), numberOfPositions: 8,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[1]._id, createdBy: companyUsers[1]._id,
        jobTitle: 'DevOps Engineer', jobDescription: 'Automate CI/CD pipelines and manage cloud infrastructure for enterprise clients.',
        jobType: 'Full-time', category: 'DevOps',
        requiredSkills: ['AWS', 'Docker', 'Jenkins', 'Terraform'],
        eligibility: { minCGPA: 7.5, allowedDepartments: ['Computer Science', 'Information Technology'], allowedBatches: [2025], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 900000, max: 1200000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Pune', workMode: 'Hybrid',
        applicationDeadline: future(28), numberOfPositions: 6,
        status: 'Active', isPublished: true, publishedDate: now,
      },
      {
        company: companies[3]._id, createdBy: tpo._id,
        jobTitle: 'Cybersecurity Analyst', jobDescription: 'Monitor security threats, conduct vulnerability assessments, and implement security measures.',
        jobType: 'Full-time', category: 'Cybersecurity',
        requiredSkills: ['Network Security', 'SIEM', 'Python'],
        eligibility: { minCGPA: 7.0, allowedDepartments: ['Computer Science', 'Information Technology', 'Electronics'], allowedBatches: [2025], allowBacklogs: false, maxBacklogs: 0 },
        salary: { min: 850000, max: 1100000, currency: 'INR', period: 'Per Annum' },
        jobLocation: 'Gurgaon', workMode: 'On-site',
        applicationDeadline: future(35), numberOfPositions: 4,
        status: 'Draft', isPublished: false,
      },
    ];

    const drives = await Drive.insertMany(driveData);

    // Update company drive counts
    for (const c of companies) {
      const count = drives.filter(d => d.company.toString() === c._id.toString()).length;
      c.totalDrivesPosted = count;
      await c.save();
    }
    console.log(`Created ${drives.length} drives`);

    // ─── 6. APPLICATIONS (spread students across drives) ───
    const applicationData = [
      // Drive 0: TCS Software Dev
      { student: studentUsers[0], drive: drives[0], status: 'Shortlisted' },
      { student: studentUsers[2], drive: drives[0], status: 'Applied' },
      { student: studentUsers[4], drive: drives[0], status: 'Under Review' },
      { student: studentUsers[5], drive: drives[0], status: 'Applied' },
      { student: studentUsers[7], drive: drives[0], status: 'Selected' },

      // Drive 1: Infosys Systems Engineer
      { student: studentUsers[0], drive: drives[1], status: 'Applied' },
      { student: studentUsers[2], drive: drives[1], status: 'Shortlisted' },
      { student: studentUsers[3], drive: drives[1], status: 'Applied' },
      { student: studentUsers[4], drive: drives[1], status: 'Applied' },
      { student: studentUsers[5], drive: drives[1], status: 'Under Review' },
      { student: studentUsers[8], drive: drives[1], status: 'Applied' },

      // Drive 2: Wipro Full Stack Dev
      { student: studentUsers[0], drive: drives[2], status: 'Interview Scheduled' },
      { student: studentUsers[5], drive: drives[2], status: 'Applied' },
      { student: studentUsers[7], drive: drives[2], status: 'Shortlisted' },

      // Drive 3: Deloitte Analyst Intern
      { student: studentUsers[9], drive: drives[3], status: 'Applied' },
      { student: studentUsers[10], drive: drives[3], status: 'Applied' },
      { student: studentUsers[11], drive: drives[3], status: 'Shortlisted' },
      { student: studentUsers[13], drive: drives[3], status: 'Applied' },
      { student: studentUsers[14], drive: drives[3], status: 'Rejected' },

      // Drive 4: Razorpay Backend Eng
      { student: studentUsers[7], drive: drives[4], status: 'Shortlisted' },
      { student: studentUsers[13], drive: drives[4], status: 'Applied' },

      // Drive 5: TCS Data Science Intern
      { student: studentUsers[1], drive: drives[5], status: 'Selected' },
      { student: studentUsers[9], drive: drives[5], status: 'Applied' },
      { student: studentUsers[11], drive: drives[5], status: 'Under Review' },

      // Drive 6: Infosys DevOps
      { student: studentUsers[5], drive: drives[6], status: 'Applied' },
      { student: studentUsers[13], drive: drives[6], status: 'Applied' },
    ];

    const applications = [];
    for (const a of applicationData) {
      const app = await Application.create({
        student: a.student._id,
        drive: a.drive._id,
        status: a.status,
        statusHistory: [
          { status: 'Applied', changedBy: a.student._id, timestamp: new Date(now.getTime() - 7 * 86400000) },
          ...(a.status !== 'Applied' ? [{ status: a.status, changedBy: tpo._id, remarks: 'Updated by TPO', timestamp: now }] : [])
        ],
        coverLetter: `I am excited to apply for this position. My skills and experience align well with the requirements.`
      });
      applications.push(app);
    }

    // Update drive application counts
    for (const d of drives) {
      const count = applications.filter(a => a.drive.toString() === d._id.toString()).length;
      const shortlisted = applications.filter(a => a.drive.toString() === d._id.toString() && a.status === 'Shortlisted').length;
      const selected = applications.filter(a => a.drive.toString() === d._id.toString() && a.status === 'Selected').length;
      d.totalApplications = count;
      d.totalShortlisted = shortlisted;
      d.totalSelected = selected;
      await d.save();
    }

    // Mark placed students
    const selectedApps = applications.filter(a => a.status === 'Selected');
    for (const app of selectedApps) {
      const profile = studentProfiles.find(p => p.user.toString() === app.student.toString());
      const drive = drives.find(d => d._id.toString() === app.drive.toString());
      const company = companies.find(c => c._id.toString() === drive.company.toString());
      if (profile) {
        profile.isPlaced = true;
        profile.placedCompany = company?.companyName;
        await profile.save();
      }
    }

    console.log(`Created ${applications.length} applications`);

    // ─── SUMMARY ───
    console.log('\n========================================');
    console.log('  SEED COMPLETE!');
    console.log('========================================');
    console.log(`  Admin:     1  (admin@campushire.com)`);
    console.log(`  TPO:       1  (tpo@campushire.com)`);
    console.log(`  Companies: ${companies.length}  (hr@tcs.com, hr@infosys.com, ...)`);
    console.log(`  Students:  ${studentUsers.length} (aarav@student.com, diya@student.com, ...)`);
    console.log(`  Drives:    ${drives.length}  (7 active + 1 draft)`);
    console.log(`  Apps:      ${applications.length}`);
    console.log('----------------------------------------');
    console.log('  Password for ALL accounts: Password@123');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
