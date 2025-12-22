-- SQL para popular a tabela de tecnologias
-- Execute este script no Supabase SQL Editor

INSERT INTO technologies (id, name, icon, color, category, "createdAt") VALUES
('11111111-1111-1111-1111-111111111111', 'React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', '#61DAFB', 'Frontend', NOW()),
('22222222-2222-2222-2222-222222222222', 'Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', '#000000', 'Frontend', NOW()),
('33333333-3333-3333-3333-333333333333', 'Vue.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', '#4FC08D', 'Frontend', NOW()),
('44444444-4444-4444-4444-444444444444', 'Angular', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', '#DD0031', 'Frontend', NOW()),
('55555555-5555-5555-5555-555555555555', 'Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', '#339933', 'Backend', NOW()),
('66666666-6666-6666-6666-666666666666', 'Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', '#000000', 'Backend', NOW()),
('77777777-7777-7777-7777-777777777777', 'NestJS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg', '#E0234E', 'Backend', NOW()),
('88888888-8888-8888-8888-888888888888', 'PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', '#336791', 'Database', NOW()),
('99999999-9999-9999-9999-999999999999', 'MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', '#47A248', 'Database', NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MySQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', '#4479A1', 'Database', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', '#3178C6', 'Language', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', '#F7DF1E', 'Language', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', '#3776AB', 'Language', NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Java', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', '#007396', 'Language', NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', '#2496ED', 'DevOps', NOW()),
('10101010-1010-1010-1010-101010101010', 'Kubernetes', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', '#326CE5', 'DevOps', NOW()),
('20202020-2020-2020-2020-202020202020', 'AWS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', '#FF9900', 'Cloud', NOW()),
('30303030-3030-3030-3030-303030303030', 'Azure', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', '#0078D4', 'Cloud', NOW()),
('40404040-4040-4040-4040-404040404040', 'Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', '#06B6D4', 'Frontend', NOW()),
('50505050-5050-5050-5050-505050505050', 'GraphQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', '#E10098', 'API', NOW())
ON CONFLICT (name) DO UPDATE SET
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    category = EXCLUDED.category;

-- Verificar se foi inserido corretamente
SELECT * FROM technologies ORDER BY category, name;
