
import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const clubFactory = new Factory()
    .attr('_id', new mongoose.Types.ObjectId())
    .sequence('name', () => faker.company.name())
    .sequence('description', () => faker.lorem.paragraph())
    .sequence('managers', () => [])
    .attr('admin', new mongoose.Types.ObjectId());

export default clubFactory;
