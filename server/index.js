import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
);
app.use(express.json());

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});
