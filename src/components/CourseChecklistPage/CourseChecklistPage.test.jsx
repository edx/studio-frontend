import React from 'react';

import { courseDetails } from '../../utils/testConstants';
import CourseChecklistPage from '.';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import messages from './displayMessages';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedCourseChecklist from '../CourseChecklist/container';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

let wrapper;

const testCourseBestPracticesData = {
  data: {
    courseBestPractices: 'courseBestPractices',
  },
};

const testCourseLaunchData = {
  data: {
    courseLaunch: 'courseLaunch',
  },
};

const defaultProps = {
  studioDetails: { ...courseDetails, enable_quality: true },
  getCourseBestPractices: () => { },
  getCourseLaunch: () => { },
  courseBestPracticesData: testCourseBestPracticesData,
  courseLaunchData: testCourseLaunchData,
  enable_quality: true,
};

describe('CourseChecklistPage', () => {
  describe('renders', () => {
    describe('if enable_quality prop is true', () => {
      it('two WrappedCourseChecklist components ', () => {
        wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

        expect(wrapper.find(WrappedCourseChecklist)).toHaveLength(2);
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.launchChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
            expect(checklist.prop('idPrefix')).toEqual('launchChecklist');
          });
        });

        describe('for the best practices checklist checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(1);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.bestPracticesChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(bestPracticesChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseBestPracticesData);
            expect(checklist.prop('idPrefix')).toEqual('bestPracticesChecklist');
          });
        });
      });
    });

    describe('if enable_quality prop is false', () => {
      const newStudioDetails = {
        ...courseDetails,
        enable_quality: false,
      };

      const newProps = {
        ...defaultProps,
        studioDetails: newStudioDetails,
      };

      it('one WrappedCourseChecklist component if enable_quality prop is false', () => {
        wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

        expect(wrapper.find(WrappedCourseChecklist)).toHaveLength(1);
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.launchChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
            expect(checklist.prop('idPrefix')).toEqual('launchChecklist');
          });
        });
      });
    });
  });

  describe('behaves', () => {
    it('calls getCourseBestPractices prop on mount', () => {
      const getCourseBestPracticesSpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseBestPractices: getCourseBestPracticesSpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseBestPracticesSpy).toHaveBeenCalledTimes(1);
      expect(getCourseBestPracticesSpy).toHaveBeenCalledWith(
        { exclude_graded: true },
        defaultProps.studioDetails.course,
      );
    });

    it('calls getCourseLaunch prop on mount', () => {
      const getCourseValidationSpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseLaunch: getCourseValidationSpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseValidationSpy).toHaveBeenCalledTimes(1);
      expect(getCourseValidationSpy).toHaveBeenCalledWith(
        { graded_only: true },
        defaultProps.studioDetails.course,
      );
    });
  });
});