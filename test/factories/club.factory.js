
import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const clubFactory = new Factory()
    .sequence('name', () => faker.company.name())
    .sequence('description', () => faker.lorem.paragraph())
    .sequence('managers', () => [])
    .attr('admin', new mongoose.Types.ObjectId());

export default clubFactory;
