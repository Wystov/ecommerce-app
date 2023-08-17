import {
  describe, it, expect, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import { type BaseInputProps } from '@/types/types';
import Api from '@/utils/api/client';
import AppLoginForm from '../AppLoginForm.vue';

describe('Login form tests', () => {
  it('should render form', () => {
    const wrapper = mount(AppLoginForm);
    expect(wrapper.find('h1.login-header').exists()).toBeTruthy();
    expect(wrapper.find('input#emailInput').exists()).toBeTruthy();
    expect(wrapper.find('input#passInput').exists()).toBeTruthy();
    expect(wrapper.find('button').exists()).toBeTruthy();
  });
});

describe('Login form computed method', () => {
  it('should return correct UserAuthOptions when dataForSignIn method is called', () => {
    const wrapper = mount(AppLoginForm);
    const mockEmailInput = wrapper.vm.$refs.emailInput as BaseInputProps;
    const mockPassInput = wrapper.vm.$refs.passInput as BaseInputProps;
    const result = wrapper.vm.dataForSignIn;
    expect(result.username === mockEmailInput.inputValue).toBeTruthy();
    expect(result.password === mockPassInput.inputValue).toBeTruthy();
  });
});

describe('Validation email methods', () => {
  it('should validate email value correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockCorrectEmail = 'hello@world.com';
    const mockIncorrectEmailWithDoubleAt = 'hello@world@test.com';
    const mockIncorrectEmailWithRandomChar = 'hello@test%#@%.c$&#om';
    expect(wrapper.vm.correctEmailAddressCheck(mockCorrectEmail)).toBeTruthy();
    expect(wrapper.vm.correctEmailAddressCheck(mockIncorrectEmailWithDoubleAt)).toBeFalsy();
    expect(wrapper.vm.correctEmailAddressCheck(mockIncorrectEmailWithRandomChar)).toBeFalsy();
  });
  it('should validate valid email correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockInputElement = document.createElement('input');
    const mockInputEvent = new Event('input') as InputEvent;
    Object.defineProperty(mockInputEvent, 'target', { value: mockInputElement, writable: false });
    mockInputElement.value = 'hello@world.com';
    wrapper.vm.emailValidation(mockInputEvent);
    expect(wrapper.vm.emailValue).toBe('valid');
  });
  it('should validate invalid email and empty email value correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockInputElement = document.createElement('input');
    const mockInputEvent = new Event('input') as InputEvent;
    Object.defineProperty(mockInputEvent, 'target', { value: mockInputElement, writable: false });
    mockInputElement.value = 'hello@world@test.com';
    wrapper.vm.emailValidation(mockInputEvent);
    expect(wrapper.vm.emailValue).toBe('invalid');
    mockInputElement.value = '';
    wrapper.vm.emailValidation(mockInputEvent);
    expect(wrapper.vm.emailValue).toBe('');
  });
});

describe('Validation password methods', () => {
  it('should validate password value correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockCorrectPasswordValue = 'asdLj7d3';
    const mockIncorrectPasswordValue = 'фывdfe5q';
    const mockTooShortPasswordValue = 'd5Idf';
    expect(wrapper.vm.correctPasswordCheck(mockCorrectPasswordValue)).toBeTruthy();
    expect(wrapper.vm.correctPasswordCheck(mockIncorrectPasswordValue)).toBeFalsy();
    expect(wrapper.vm.correctPasswordCheck(mockTooShortPasswordValue)).toBeFalsy();
  });
  it('should validate valid password correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockInputElement = document.createElement('input');
    const mockInputEvent = new Event('input') as InputEvent;
    Object.defineProperty(mockInputEvent, 'target', { value: mockInputElement, writable: false });
    mockInputElement.value = 'asdLj7d3';
    wrapper.vm.passwordValidation(mockInputEvent);
    expect(wrapper.vm.passValue).toBe('valid');
  });
  it('should validate invalid password and empty password value correctly', () => {
    const wrapper = mount(AppLoginForm);
    const mockInputElement = document.createElement('input');
    const mockInputEvent = new Event('input') as InputEvent;
    Object.defineProperty(mockInputEvent, 'target', { value: mockInputElement, writable: false });
    mockInputElement.value = 'фывdfe5q';
    wrapper.vm.passwordValidation(mockInputEvent);
    expect(wrapper.vm.passValue).toBe('invalid');
    mockInputElement.value = '';
    wrapper.vm.passwordValidation(mockInputEvent);
    expect(wrapper.vm.passValue).toBe('');
  });
});

describe('Show password method', () => {
  it('It should change input type by click on the eye icon', async () => {
    const wrapper = mount(AppLoginForm);
    const passInput = wrapper.findComponent({ ref: 'passInput' });
    const eyeIcon = passInput.find('.input-icon');
    await wrapper.vm.$nextTick();
    passInput.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hidePass).toBe('show');
    expect(wrapper.vm.passInputType).toBe('password');
    await wrapper.vm.$nextTick();
    eyeIcon.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hidePass).toBe('hide');
    expect(wrapper.vm.passInputType).toBe('text');
  });
});

describe('Sing in function succeeded', () => {
  it('should redirect to main page if sign in is successful', async () => {
    const signInCustomerMock = vi.fn().mockResolvedValue({ ok: true });
    Api.signInCustomer = signInCustomerMock;
    const pushMock = vi.fn();
    const mockRouter = {
      push: pushMock,
    };
    const wrapper = mount(AppLoginForm, {
      global: {
        mocks: {
          $router: mockRouter,
        },
      },
    });
    wrapper.vm.passValue = 'valid';
    wrapper.vm.emailValue = 'valid';
    await wrapper.vm.signIn();
    expect(signInCustomerMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});

describe('Sign in function not successful', () => {
  it('should set wrongDataText and wrongData if sign in fails', async () => {
    const signInCustomerMock = vi.fn().mockResolvedValue({ ok: false, message: 'Error message' });
    Api.signInCustomer = signInCustomerMock;
    const wrapper = mount(AppLoginForm);
    wrapper.vm.passValue = 'valid';
    wrapper.vm.emailValue = 'valid';
    await wrapper.vm.signIn();
    expect(signInCustomerMock).toHaveBeenCalled();
    expect(wrapper.vm.wrongDataText).toBe('Error message');
    expect(wrapper.vm.wrongData).toBe(true);
  });

  it('should not call signInCustomer if emailValue or passValue is invalid', async () => {
    const signInCustomerMock = vi.fn().mockResolvedValue({ ok: true });
    Api.signInCustomer = signInCustomerMock;
    const wrapper = mount(AppLoginForm);
    wrapper.vm.passValue = 'invalid';
    wrapper.vm.emailValue = 'invalid';
    await wrapper.vm.signIn();
    expect(signInCustomerMock).not.toHaveBeenCalled();
  });
});
